

const allowlist = ["http://localhost:5173"];

const corsOptions = {
  origin: function (origin:string | undefined, callback:(err: Error | null, allow?: boolean) => void) {
    if (allowlist.includes(origin as string)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  exposedHeaders: ["WWW-Authenticate"],
};

export default corsOptions;
