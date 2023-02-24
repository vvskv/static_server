import http from "node:http";
import fs, { readdir, stat } from "node:fs";

import { join } from "node:path";
import { parse } from "url";
import url from "url";

console.log("---Server---");

const server = http.createServer((req, res) => {
      const path = join(process.cwd(), "files", parse(req.url).href);
      const page404 = join(process.cwd(), "files", "404.html");

      if (req.method === "GET") {
            try {
                  stat(path, (err, stats) => {
                        if (err) {
                              fs.readFile(page404, (err, file) => {
                                    if (err) {
                                          console.log(err);
                                    } else {
                                          res.writeHead(404, "Not Found");
                                          res.end(file);
                                    }
                              });
                              return;
                        }

                        if (stats.isDirectory()) {
                              fs.readdir(path, (err, files) => {
                                    res.end(files.toString());
                              });
                        } else {
                              fs.readFile(path, (err, data) => {
                                    res.writeHead(200, {
                                          "Content-Type": "text/html",
                                    });
                                    res.end(data);
                              });
                        }
                  });
            } catch (error) {
                  console.log(error);
            }
      }
});

server.listen(8000);
