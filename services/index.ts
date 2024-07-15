export function parseMessage<T extends Record<string, any>>(
  object: T,
  template: string,
) {
  // regular expression to match placeholders like {{field}}
  const placeholderRegex = /{{(.*?)}}/g;

  // Use a replace function to replace placeholders with corresponding values
  const parsedMessage = template.replace(
    placeholderRegex,
    (match, fieldName) => {
      // The fieldName variable contains the field name inside the placeholder
      // Check if the field exists in the event object
      if (object.hasOwnProperty(fieldName)) {
        return object[fieldName]; // Replace with the field's value
      } else {
        // Placeholder not found in event, leave it unchanged
        return match;
      }
    },
  );

  return parsedMessage;
}
