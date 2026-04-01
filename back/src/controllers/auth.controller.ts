import type z from 'zod';
import { AuthSchema, LoginSchema, PatchSchema } from '../schema/auth.schema';
import type { Request, Response } from 'express';
import { convertInMs } from '../utils/time.utils';
import {
  deleteRefreshToken,
  deleteUser,
  getCurrentUser,
  login,
  updateUser,
  refreshUserToken,
  registerUser,
  type UserError,
} from '../services/auth.service';
import { AuthRequest } from '../middlewares/auth.middleware';
import { clearCookiesUser } from '../utils/clearAuthCookies';

//Typage Typescript
type AuthFormValues = z.infer<typeof AuthSchema>;
type LoginFormValues = z.infer<typeof LoginSchema>;
type PatchFormValues = z.infer<typeof PatchSchema>;

interface CustomError {
  status: number;
  message: string;
  code?: string;
}

//function d'enregistrement d'un utilisateur dans la base de données avec les informations fournie par le frontend
export const registerUserController = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { username, email, password, confirmPassword }: AuthFormValues = AuthSchema.parse(
      req.body
    );

    // validation des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }

    // appelle auth service pour enregistrer l'utilisateur
    const user = await registerUser(username, email, password);

    // creation d'une constante newuser contenant les information de user sans le password
    const newUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    // renvoi de la response
    return res
      .status(201)
      .json({ success: true, message: 'User created successfully', data: newUser });
  } catch (error) {
    // gestion des erreurs
    if (error) {
      const userError = error as UserError;
      if (userError.field === 'username') {
        return res
          .status(userError.status || 409)
          .json({ success: false, message: userError.message || 'Username already taken' });
      } else if (userError?.field === 'generic') {
        return res
          .status(userError.status || 409)
          .json({ success: false, message: userError.message || 'Invalid credentials' });
      }
    }
    console.error('Register error :', error);
    return res.status(500).json({ success: false, message: 'Unknown error' });
  }
};

export const loginUserController = async (req: Request, res: Response) => {
  try {
    // validation du body de la requête
    const { email, password, rememberMe } = LoginSchema.parse(req.body) as LoginFormValues;
    // appelle auth service pour se connecter
    const { user, token, refreshToken } = await login(email, password, rememberMe);

    // mise en place des cookies
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.JWT_EXPIRES_IN as string),
      path: '/api',
    });
    res.cookie('refreshtoken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.REFRESH_TOKEN_EXPIRES_IN as string),
      path: '/api',
    });

    // creation d'une constante newuser contenant les information de user sans le password
    const newuser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };

    //response au frontend de la reussite de la connexion
    return res.status(200).json({ success: true, message: 'Login successful', data: newuser });
  } catch (error) {
    const userError = error as UserError;
    // Gestion des erreurs
    if (userError.message === 'INVALID_CREDENTIALS') {
      return res.status(401).json({ success: false, message: 'INVALID_CREDENTIALS' });
    }
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

export const getCurrentUserController = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    const user = await getCurrentUser(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({ success: true, data: user });
  } catch (error) {
    console.error('getCurrentUser error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const refreshTokenController = async (req: Request, res: Response) => {
  try {
    const refreshToken = req.cookies['refreshToken'];
    if (!refreshToken) {
      return res.status(401).json({ success: false, message: 'No refresh token provided' });
    }

    const { token, user } = await refreshUserToken(refreshToken);

    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: convertInMs(process.env.JWT_EXPIRES_IN as string),
    });

    return res.json({ success: true, data: user });
  } catch (error: any) {
    console.error('refreshTokenController error:', error);
    return res.status(error?.status || 401).json({
      success: false,
      message: error?.message || 'Could not refresh token',
    });
  }
};

export const deleteUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'User ID is required' });
  }
  try {
    await deleteUser(Number(userId));

    clearCookiesUser(res);

    return res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('deleteUserController error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const logoutUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  try {
    await deleteRefreshToken(Number(userId));
    clearCookiesUser(res);
    return res.status(200).json({ success: true, message: 'Logout successful' });
  } catch (error) {
    console.error('logoutUserController error', error);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const patchUserController = async (req: AuthRequest, res: Response) => {
  const userId = req.params.id;

  if (!userId) {
    return res.status(401).json({ success: false, message: 'Not authenticated' });
  }
  try {
    // validation du body de la requête

    const { username, email, password, confirmPassword }: PatchFormValues = PatchSchema.parse(
      req.body
    );
    // validation des mots de passe
    if (password !== confirmPassword) {
      return res.status(400).json({ success: false, message: 'Passwords do not match' });
    }
    //
    // appelle auth service pour modifier l'utilisateur
    const user = await updateUser(Number(userId), username, email, password);
    // creation d'une constante newuser contenant les information de user sans le password
    const newUser = {
      id: user.id,
      username: user.username,
      email: user.email,
    };
    return res
      .status(200)
      .json({ success: true, message: 'User updated successfully', data: newUser });
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ success: false, message: error.message });
    } else if (error && typeof error === 'object') {
      if ('status' in error && 'message' in error) {
        const customError = error as CustomError;
        res.status(customError.status).json({ success: false, message: customError.message });
      } else if ('status' in error && 'errors' in error) {
        const customError = error as { status: number; errors: Array<{ message: string }> };
        res.status(customError.status).json({ success: false, errors: customError.errors });
      } else {
        console.error('patchUserController error (unknown object):', error);
        res.status(500).json({ success: false, message: 'Server error' });
      }
    } else {
      console.error('patchUserController error (unknown type):', error);
      res.status(500).json({ success: false, message: 'Server error' });
    }
  }
};
