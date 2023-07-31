import Server, {
  Context,
  HttpRequest,
  RenderOptions,
} from "https://deno.land/x/fastro@v0.77.6/mod.ts";
import app from "./pages/app.tsx";

// Create a server instance
const s = new Server();

// Simulate async method
const getUser = (data?: string) => Promise.resolve(data);

// Redirect to http://localhost:8000/users/123
s.get("/", () => {
  // See: https://developer.mozilla.org/en-US/docs/Web/API/Response/redirect_static
  return Response.redirect("http://localhost:8000/users/123", 307);
});

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
    const user = await getUser(req.params?.id);

    const options: RenderOptions = {
      // Inject data to component via props options
      props: { data: user },
      // set HTTP status
      // You can change with another
      status: 200,
      // Put your SEO setting here
      // You can change the value dynamically
      // You can add the meta data also
      // See: https://deno.land/x/fastro/mod.ts?s=RenderOptions
      html: { head: { title: `Hello, User #${user}` } },
    };

    // Render react component from server
    return ctx.render(options);
  },
);

// Specify a static path for the auto-generated JS file
s.static("/static", { folder: "static", maxAge: 90 });

// Serves HTTP requests
await s.serve();
