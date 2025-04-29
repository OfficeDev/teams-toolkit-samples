import * as jwt from "jsonwebtoken";
import jwksClient from "jwks-rsa";
import { ExpectedMicrosoftApps } from "./constants";

export class Utils {
  static async validateToken(validationToken: string, tenantId: string, audience: string) {
    const getSigningKeys = (header, callback) => {
      const client = jwksClient({
        jwksUri: `https://login.microsoftonline.com/${tenantId}/discovery/keys`
      });

      client.getSigningKey(header.kid, function (err, key) {
        const signingKey = key.getPublicKey();
        callback(null, signingKey);
      });
    }

    const decodedToken: jwt.JwtPayload = jwt.decode(validationToken, { json: true });

    const isV2Token = decodedToken.ver === "2.0";

    const verifyOptions = {
      audience,
      issuer: isV2Token ? `https://login.microsoftonline.com/${tenantId}/v2.0` : `https://sts.windows.net/${tenantId}/`,
    }

    return new Promise<void>((resolve, reject) => {
      jwt.verify(validationToken, getSigningKeys, verifyOptions, (err, payload: jwt.JwtPayload) => {
        if (err) {
          reject(err);
          return;
        }

        const appId = isV2Token ? payload.azp : payload.appid;

        if (!ExpectedMicrosoftApps.includes(appId)) {
          reject("Not Expected Microsoft Apps.")
          return;
        }

        console.log("Token is validated.")
        resolve();
      });
    })
  }

  static async sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

