export default function DateTime(props: { dateTime: string }) {
  return (
    <time dateTime={props.dateTime}>
      {new Date(props.dateTime).toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "numeric",
        minute: "numeric",
        second: "numeric",
      })}
    </time>
  );
}
