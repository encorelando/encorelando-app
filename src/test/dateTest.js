/**
 * Test file for date utility functions
 * Run this to check if the date handling is correct
 */

import { getValidDateString } from '../utils/dateUtils';

// Test with various date formats
const testDates = [
  '2023-05-02',                // Just date
  '2023-05-02T12:00:00',       // ISO with time
  '2023-05-02T12:00:00Z',      // ISO with UTC timezone
  '2023-05-02T12:00:00-04:00', // ISO with specific timezone
  new Date('2023-05-02'),      // Date object
];

console.log('Date String Test Results:');
console.log('=========================');

testDates.forEach(date => {
  console.log(`Original: ${typeof date === 'string' ? date : date.toISOString()}`);
  console.log(`Extracted date: ${getValidDateString(date)}`);
  console.log('-------------------------');
});

// Adding additional test for current issue
// A performance on May 2nd should show May 2nd, not May 1st
const mayPerformance = new Date('2023-05-02T20:00:00');
console.log('Performance Date Test:');
console.log(`Performance on: ${mayPerformance.toISOString()}`);
console.log(`Should extract as: 2023-05-02`);
console.log(`Actually extracts as: ${getValidDateString(mayPerformance)}`);
