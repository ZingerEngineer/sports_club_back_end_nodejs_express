import axios from 'axios'
import dotenv from 'dotenv'
import qs from 'querystring'
dotenv.config()

type GoogleAuthorizationData = {
  id_token: string
  access_token: string
}

type GoogleAuthenticationData = {
  id: string
  email: string
  verified_email: boolean
  name: string
  given_name: string
  family_name: string
  picture: string
}

type GoogleAuthenticationFunction = (
  id_token: string,
  access_token: string
) => Promise<GoogleAuthenticationData>

type GoogleAuthorizationFunction = (
  code: string
) => Promise<GoogleAuthorizationData>

const getGoogleOAuthTokens: GoogleAuthorizationFunction = async (
  code: string
) => {
  const rootURL = 'https://oauth2.googleapis.com/token'
  const values = {
    code,
    client_id: process.env.CLIENT_ID_SECRET,
    client_secret: process.env.CLIENT_SECRET,
    redirect_uri: process.env.GOOGLE_OAUTH_REDIRECT_URI_SECRET,
    grant_type: 'authorization_code'
  }
  try {
    const res = await axios.post(rootURL, qs.stringify(values), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
    return res.data
  } catch (error) {
    throw new Error('google auth failed')
  }
}

const getGoogleUser: GoogleAuthenticationFunction = async (
  id_token,
  access_token
) => {
  try {
    const userInfoResponse = await axios.get(
      `https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${access_token}`,
      {
        headers: {
          Authorization: `Bearer ${id_token}`
        }
      }
    )
    if (!userInfoResponse.data) throw new Error('invalid user credentials')
    return userInfoResponse.data
  } catch (error) {
    throw new Error('getting user data failed')
  }
}

export { getGoogleOAuthTokens, getGoogleUser }
