'use client';

import { server_api } from '@/paths';
import type { User } from '@/types/user';
import axios from 'axios';

export interface SignUpParams {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface SignInWithOAuthParams {
  provider: 'google' | 'discord';
}

export interface SignInWithPasswordParams {
  email: string;
  password: string;
}

export interface ResetPasswordParams {
  email: string;
}

class AuthClient {
  async signUp(_: SignUpParams): Promise<{ error?: string }> {
    // Make API request

    // We do not handle the API, so we'll just generate a token and store it in localStorage.
    const token = "abc";
    localStorage.setItem('access-token', token);

    return {};
  }

  async signInWithOAuth(_: SignInWithOAuthParams): Promise<{ error?: string }> {
    return { error: 'Social authentication not implemented' };
  }

  async signInWithPassword(params: SignInWithPasswordParams): Promise<{ error?: string }> {
    const { email, password } = params;

    // Make API request
    await axios({
      method: 'POST',
      url: server_api.auth.login,
      headers: {
        "Content-Type": "application/json"
      },
      data: JSON.stringify({
        email: email,
        password: password
      })
    })
      .then((res) => {
        const accessToken = res.data?.token.accessToken
        const userID = res.data?.userId
        // const resetToken = res.data?.resetToken
        localStorage.setItem('access-token', accessToken);
        localStorage.setItem('userID', userID);
        // localStorage.setItem('reset-token', resetToken);
        return { error: false };
      })
      .catch(error => {
        return { error: error }
      })
    return {};
  }

  async resetPassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Password reset not implemented' };
  }

  async updatePassword(_: ResetPasswordParams): Promise<{ error?: string }> {
    return { error: 'Update reset not implemented' };
  }

  async getUser(): Promise<{ data?: User | any | null; error?: string }> {
    // Make API request
    const userID = localStorage.getItem('userID');
    const accessToken = localStorage.getItem('access-token');

    if (!accessToken) {
      return { data: null };
    }
    let resp = {
      id: userID,
      name: "",
      avatar: "",
      email: ""
    };
    await axios({
      method: 'GET',
      url: server_api.user.getUserData,
      headers: {
        "Content-Type": "application/json",
        "CLIENT_ID": userID,
        "ACCESS_TOKEN": accessToken
      }
    })
      .then(res => { 
        resp.name = res.data?.name
        localStorage.setItem('name',res.data?.name)
        resp.email = res.data?.email
        localStorage.setItem('email',res.data?.email)
      } )
    return { data: resp };
  }

  async signOut(): Promise<{ error?: string }> {
    localStorage.removeItem('access-token');

    return {};
  }
}

export const authClient = new AuthClient();
