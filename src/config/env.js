/**
 * 配置编译环境和线上环境之间的环境变量
 */
let devService = "";
if (process.env.NODE_ENV == "development") {
  devService = `/dev`;
} else if (process.env.NODE_ENV == "test") {
  devService = `/dev`;
} else {
  devService = `/dev`;
}

export {
  devService
};
