export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

/** Full class names written out so Tailwind's scanner can find them (never build them with `text-${…}`). */
const COLOR: Record<HttpMethod, string> = {
  GET: "text-get",
  POST: "text-post",
  PUT: "text-put",
  PATCH: "text-patch",
  DELETE: "text-delete",
};

interface MethodBadgeProps {
  method: HttpMethod;
  className?: string;
}

export function MethodBadge({ method, className = "" }: MethodBadgeProps) {
  return (
    <span className={`font-mono text-[10px] font-semibold ${COLOR[method]} ${className}`}>
      {method === "DELETE" ? "DEL" : method}
    </span>
  );
}
