import Koa from "koa";
import api from "./api";

const startServer = async () => {
  const server = new Koa();
  server.use(api.routes());
  server.listen(3000);
  console.info(`server start on port: 3000`);
};

startServer().catch((e: Error) => console.error(e));
