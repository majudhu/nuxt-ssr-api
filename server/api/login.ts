import { hash, verify } from '@node-rs/argon2';

export default defineEventHandler(async (event) => {
  const session = await useSession(event, {
    password: useRuntimeConfig().h3SessionPassword,
  });

  switch (event.node.req.method) {
    case 'GET': {
      if (session.data.user) {
        return { user: session.data.user };
      } else {
        setResponseStatus(event, 404);
        return { error: 'Session not found' };
      }
    }

    case 'POST': {
      const { username, password } = await readBody(event);
      const storage = useStorage();
      const hashedPassword = (await storage.getItem('adminpassword')) as string;
      if (
        username === 'admin' &&
        (!hashedPassword || (await verify(hashedPassword, password)))
      ) {
        await session.update({ user: username });
        if (!hashedPassword) {
          await storage.setItem('adminpassword', await hash(password));
        }
        return { user: username };
      } else {
        setResponseStatus(event, 403);
        return { error: 'Invalid username or password' };
      }
    }

    case 'PUT': {
      if (session.data.user !== 'admin') {
        setResponseStatus(event, 403);
        return { error: 'Invalid user' };
      }
      const { password, newpassword } = await readBody(event);
      const storage = useStorage();
      const hashedPassword = (await storage.getItem('adminpassword')) as string;
      if (newpassword && (await verify(hashedPassword, password))) {
        await storage.setItem('adminpassword', await hash(newpassword));
        setResponseStatus(event, 204);
        return null;
      } else {
        setResponseStatus(event, 403);
        return { error: 'Invalid password' };
      }
    }

    case 'DELETE': {
      await session.clear();
      setResponseStatus(event, 204);
      return null;
    }

    default: {
      setResponseStatus(event, 405);
      return { error: 'Method not allowed' };
    }
  }
});
