export function validateMessageForm(
  selectedChannel: string,
  message: string,
): string | null {
  if (!selectedChannel || !message.trim()) {
    return 'Please select a channel and enter a message';
  }
  return null;
}

export function validateScheduledTime(scheduledTime: Date): boolean {
  return scheduledTime > new Date();
}
