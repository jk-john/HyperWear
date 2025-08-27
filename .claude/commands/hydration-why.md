# React Hydration Error — Why This Error Occurred

While rendering your application, there was a difference between the React tree that was pre-rendered on the server and the React tree that was rendered during the first render in the browser (hydration).

Hydration is when React converts the pre-rendered HTML from the server into a fully interactive application by attaching event handlers.

---

## Common Causes

Hydration errors can occur from:

1. **Incorrect nesting of HTML tags**
   - `<p>` nested inside another `<p>`
   - `<div>` nested inside a `<p>`
   - `<ul>` or `<ol>` nested inside a `<p>`
   - Interactive content nested improperly (e.g., `<a>` inside `<a>`, `<button>` inside `<button>`, etc.)

2. **Using checks like `typeof window !== 'undefined'` in rendering logic**

3. **Using browser-only APIs** (e.g., `window`, `localStorage`) in rendering logic

4. **Using time-dependent APIs**, such as the `Date()` constructor, during rendering

5. **Browser extensions modifying the HTML**

6. **Incorrectly configured CSS-in-JS libraries**
   - Ensure your code follows official examples

7. **Edge/CDN configurations modifying the HTML response**, like Cloudflare Auto Minify

---

## Possible Ways to Fix It

### **Solution 1: Use `useEffect` for client-only behavior**

Ensure that server-rendered content matches the initial client-side render. To deliberately render differing content on the client, use the `useEffect` hook:

```jsx
import { useState, useEffect } from "react";

export default function App() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return <h1>{isClient ? "This is never prerendered" : "Prerendered"}</h1>;
}
```
