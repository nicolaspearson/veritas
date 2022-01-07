/* eslint-disable @typescript-eslint/naming-convention */
// https://auth0.github.io/node-auth0/
import { ManagementClient } from 'auth0';
import axios, { AxiosError } from 'axios';
import Boom from 'boom';

import { LoginRequest, RegisterUserRequest } from '$/common/dto';
import { log } from '$/common/logger';

type Options = {
  audience: string;
  clientId: string;
  clientSecret: string;
  domain: string;
};

type TokenResponse = {
  access_token: string;
  expires_in: number;
  token_type: string;
};

export class Auth0Client {
  private static instance: Auth0Client;
  private managementClient: ManagementClient;

  private clientOptions: Options;
  private m2mOptions: Options;

  constructor() {
    this.clientOptions = {
      audience: `https://${process.env.AUTH0_DOMAIN!}/api/v2/`,
      clientId: process.env.AUTH0_CLIENT_ID!,
      clientSecret: process.env.AUTH0_CLIENT_SECRET!,
      domain: process.env.AUTH0_DOMAIN!,
    };
    this.m2mOptions = {
      audience: `https://${process.env.AUTH0_M2M_DOMAIN!}/api/v2/`,
      clientId: process.env.AUTH0_M2M_CLIENT_ID!,
      clientSecret: process.env.AUTH0_M2M_CLIENT_SECRET!,
      domain: process.env.AUTH0_M2M_DOMAIN!,
    };
    this.managementClient = this.createManagementClient(this.m2mOptions);
  }

  static getInstance(): Auth0Client {
    if (!Auth0Client.instance) {
      Auth0Client.instance = new Auth0Client();
    }
    return Auth0Client.instance;
  }

  /**
   * Creates a new management client instance.
   *
   * https://auth0.com/docs/secure/tokens/access-tokens/management-api-access-tokens
   */
  private createManagementClient(options: Options): ManagementClient {
    return new ManagementClient({
      ...options,
      scope: 'read:users create:users',
      tokenProvider: {
        enableCache: true,
        cacheTTLInSeconds: 10,
      },
    });
  }

  /**
   * Get an access token from Auth0 with an email and password combination.
   *
   * https://auth0.com/docs/api/authentication#resource-owner-password
   *
   * @returns an access token
   */
  async userSignIn(dto: LoginRequest, ipAddress: string): Promise<string> {
    try {
      const response: { data: TokenResponse } = await axios.post(
        `https://${this.clientOptions.domain}/oauth/token`,
        {
          username: dto.email,
          password: dto.password,
          grant_type: 'password',
          client_id: this.clientOptions.clientId,
          client_secret: this.clientOptions.clientSecret,
          audience: this.clientOptions.audience,
        },
        {
          headers: {
            'auth0-forwarded-for': ipAddress,
          },
        },
      );
      if (response.data.access_token) {
        return response.data.access_token;
      }
    } catch (error) {
      const axiosError = error as AxiosError;
      if (axiosError.isAxiosError)
        // This could contain sensitive information and should
        // be changed to avoid exposing such information.
        log(axiosError.toJSON());
    }
    throw Boom.unauthorized('Invalid email address or password provided.');
  }

  /**
   * Creates a new user in Auth0.
   *
   * https://auth0.com/docs/api/management/v2/#!/Users/post_users
   *
   * @returns an access token
   */
  async userRegistration(dto: RegisterUserRequest): Promise<Auth0Id> {
    const user = await this.managementClient.createUser({
      connection: 'Username-Password-Authentication',
      email: dto.email,
      username: undefined,
      email_verified: false,
      verify_email: false,
      user_id: undefined,
      blocked: false,
      nickname: undefined,
      picture: undefined,
      password: dto.password,
      phone_number: undefined,
      given_name: undefined,
      family_name: undefined,
      name: dto.name,
      user_metadata: {},
      app_metadata: {},
    });
    return user.user_id! as Auth0Id;
  }

  /**
   * Gets a user in Auth0 using the provided email address.
   *
   * https://auth0.com/docs/api/management/v2/#!/Users/post_users
   *
   * @returns an access token
   */
  async userGetByEmail(email: Email): Promise<Auth0Id | null> {
    const users = await this.managementClient.getUsersByEmail(email);
    if (users.length > 0) {
      return users[0].user_id! as Auth0Id;
    }
    return null;
  }
}