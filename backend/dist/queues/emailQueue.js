import Queue from "bull";
export const emailQueue = new Queue("email", {
    redis: {
        host: "127.0.0.1",
        port: 6380,
    },
});
