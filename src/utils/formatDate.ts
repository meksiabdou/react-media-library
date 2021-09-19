export default function formatDate(date: any): string {
  try {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("en-US", options as Object);
  } catch (error) {
    return date.toString();
  }
}
