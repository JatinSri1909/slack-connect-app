export function formatDateTime(scheduledTime: number | string): string {
  let date: Date;

  if (typeof scheduledTime === 'number') {
    // If it's a number, it could be Unix timestamp in seconds or milliseconds
    if (scheduledTime > 1000000000000) {
      // It's already in milliseconds
      date = new Date(scheduledTime);
    } else {
      // It's in seconds, convert to milliseconds
      date = new Date(scheduledTime * 1000);
    }
  } else {
    // It's a string, try to parse it directly
    date = new Date(scheduledTime);
  }

  // Check if the date is valid
  if (isNaN(date.getTime())) {
    console.error('Invalid date:', scheduledTime, typeof scheduledTime);
    return 'Invalid Date';
  }

  return date.toLocaleString();
}

export function getStatusVariant(
  status: string,
): 'secondary' | 'default' | 'destructive' {
  switch (status) {
    case 'pending':
      return 'secondary';
    case 'sent':
      return 'default';
    case 'failed':
      return 'destructive';
    default:
      return 'secondary';
  }
}
