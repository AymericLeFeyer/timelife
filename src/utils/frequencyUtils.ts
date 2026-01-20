export function formatFrequency(frequency: number | string): string {
  if (typeof frequency === 'string') {
    return frequency;
  }

  if (frequency >= 0.8) {
    return 'Daily';
  } else if (frequency >= 0.5) {
    return 'Weekly';
  } else if (frequency >= 0.2) {
    return 'Monthly';
  } else if (frequency > 0) {
    return 'Rarely';
  } else {
    return 'Never';
  }
}
