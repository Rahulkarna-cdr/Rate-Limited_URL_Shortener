## Rate Limiter Design & Behavior

This implementation uses a **fixed window rate limiting approach**. Each client is identified by their IP address, and a request counter is maintained for a fixed time window.

### Data Structure

An in-memory `Map` is used to store request data in the following format:

IP → {
count: number,
resetAt: timestamp
}

- `count` tracks how many requests have been made within the current window.
- `resetAt` defines when the current window expires.

---

### Request Flow

For every incoming request:

- **New IP or expired window**  
  If no record exists for the IP, or the current time has passed `resetAt`, a new entry is created:
  - `count` is set to 1  
  - `resetAt` is set to current time + window duration  
  The request is allowed.

- **Within active window**  
  If the request falls within the active window:
  - If `count` is less than the allowed limit, it is incremented and the request proceeds.
  - If `count` has reached the limit, the request is blocked.

- **Limit exceeded**  
  When the request limit is exceeded:
  - A `429 Too Many Requests` response is returned.
  - The remaining wait time is calculated using:  
    `Math.ceil((resetAt - now) / 1000)`
  - This value is sent via the `Retry-After` response header.

---

### Frontend Integration

The `Retry-After` header is used by the frontend to provide a better user experience. Instead of showing a static error message, the UI reads this value and displays a live countdown until the user can retry.

---

### Limitations & Considerations

- **Burst traffic at window boundaries**  
  Since this is a fixed window approach, a client can make requests at the end of one window and immediately again at the start of the next, effectively exceeding the intended rate in a short period.

- **In-memory storage**  
  All rate limiting data is stored in process memory. This means:
  - Data is lost if the server restarts
  - It does not work across multiple server instances

- **Memory growth**  
  Entries are not automatically removed after expiration. Without a cleanup mechanism, the store may grow over time as new IPs are added.

- **IP-based identification**  
  Clients are identified using IP addresses, which may not always be reliable (e.g., shared networks or proxy usage).

---

### Possible Improvements

- Introduce a cleanup routine to remove expired entries and control memory usage.
- Use a distributed store such as Redis to support multiple instances.
- Replace fixed window logic with a sliding window or token bucket algorithm for more accurate rate control.