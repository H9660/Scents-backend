import { SESClient, SendTemplatedEmailCommand } from "@aws-sdk/client-ses"; // ES Modules import
import dotenv from "dotenv"
dotenv.config()
const SES_CONFIG = {
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_SES_REGION,
};

export const Send = async (templateData: any, recipientEmail: string) => {
  console.log(templateData)
  const client = new SESClient(SES_CONFIG);
  const input = 
    {
      "FromEmailAddress": "Mary Major <mary.major@example.com>",
      "Destination": {
          "ToAddresses": [
              "alejandro.rosalez@example.com", "jimmy.jet@example.com"
          ]
      },
      "Content": {
          "Template": {
              "TemplateName": "MyTemplate",
              "TemplateData": "{ \"name\":\"Alejandro\", \"favoriteanimal\": \"alligator\" }"
          }
      },
      "ConfigurationSetName": "ConfigSet"
  };
  try {
    const command = new SendTemplatedEmailCommand(input as any);
    const response = await client.send(command);
    return response
  } catch (error) {
    console.log(error);
  }
};
