import Server, {
  Context,
  HttpRequest,
  RenderOptions,
} from "https://deno.land/x/fastro@v0.77.5/mod.ts";
import app from "./pages/app.tsx";

// Create a server instance
const s = new Server();

// Simulate async method
const getUser = (data?: string) => Promise.resolve(data);

// The endpoint for the root URL
s.get(
  "/",
  () => "To try the URL pattern, please open: http://localhost:8000/users/123",
);

// Create an SSR page endpoint
s.page(
  // URL end point with regex
  // You can access with url: http://localhost:8000/users/123
  // You can not access with url: http://localhost:8000/users/abc
  "/users/:id(\\d+)",
  // The React component
  app,
  // The page handler
  async (req: HttpRequest, ctx: Context) => {
    // Get data from async method with url params
    const data = await getUser(req.params?.id);

    const options: RenderOptions = {
      // Inject data to component via props options
      props: { data },
      // set HTTP status
      // You can change with another
      status: 200,
      // Put your SEO setting here
      // You can change the value dynamically
      html: { head: { title: "React Component" } },
    };

    // Render react component from server
    return ctx.render(options);
  },
);

// Specify a static path for the auto-generated JS file
s.static("/static", { folder: "static", maxAge: 90 });

// Serves HTTP requests
await s.serve();
