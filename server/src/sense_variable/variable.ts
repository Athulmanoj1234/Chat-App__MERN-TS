import dotenv from  "dotenv"

dotenv.config();

const server_Port = process.env.PORT;
const google_BaseUrl = process.env.GOOGLE_INPUT_BASE_URL;
const google_QueryString = process.env.GOOGLE_INPUT_QUERY_STRING;
const client_Url = process.env.CLIENT_URL;

export { server_Port, google_BaseUrl, google_QueryString, client_Url };
