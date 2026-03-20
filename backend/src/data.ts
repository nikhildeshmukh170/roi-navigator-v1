import type { UniversityDB } from './types.js'

export const UNI_DB: UniversityDB = {
  Canada: [
    { name: 'University of Toronto', loc: 'Toronto, ON', tuition: 38200, ttj: 11, pr: 71, be: 29, s1: 48, s2: 57, s3: 67, cost_inr: 4120000 },
    { name: 'University of Waterloo', loc: 'Waterloo, ON', tuition: 34600, ttj: 9, pr: 68, be: 26, s1: 51, s2: 61, s3: 71, cost_inr: 3880000 },
    { name: 'UBC Vancouver', loc: 'Vancouver, BC', tuition: 40200, ttj: 10, pr: 73, be: 27, s1: 50, s2: 59, s3: 69, cost_inr: 4360000 },
    { name: 'McGill University', loc: 'Montreal, QC', tuition: 33800, ttj: 13, pr: 66, be: 31, s1: 45, s2: 54, s3: 63, cost_inr: 3950000 },
    { name: 'Toronto Metropolitan', loc: 'Toronto, ON', tuition: 28400, ttj: 14, pr: 65, be: 33, s1: 42, s2: 50, s3: 60, cost_inr: 3510000 },
  ],
  UK: [
    { name: 'University College London', loc: 'London, UK', tuition: 32000, ttj: 12, pr: 58, be: 34, s1: 52, s2: 64, s3: 78, cost_inr: 4480000 },
    { name: 'University of Manchester', loc: 'Manchester, UK', tuition: 28500, ttj: 13, pr: 55, be: 36, s1: 48, s2: 60, s3: 72, cost_inr: 3920000 },
    { name: 'University of Edinburgh', loc: 'Edinburgh, UK', tuition: 29000, ttj: 14, pr: 54, be: 38, s1: 46, s2: 58, s3: 70, cost_inr: 4010000 },
    { name: 'King\'s College London', loc: 'London, UK', tuition: 33000, ttj: 13, pr: 56, be: 35, s1: 50, s2: 62, s3: 75, cost_inr: 4520000 },
  ],
  Australia: [
    { name: 'University of Melbourne', loc: 'Melbourne, VIC', tuition: 42000, ttj: 10, pr: 69, be: 28, s1: 48, s2: 57, s3: 67, cost_inr: 4650000 },
    { name: 'UNSW Sydney', loc: 'Sydney, NSW', tuition: 40500, ttj: 11, pr: 67, be: 30, s1: 46, s2: 55, s3: 65, cost_inr: 4480000 },
    { name: 'Monash University', loc: 'Melbourne, VIC', tuition: 38000, ttj: 12, pr: 65, be: 32, s1: 44, s2: 53, s3: 62, cost_inr: 4210000 },
    { name: 'University of Sydney', loc: 'Sydney, NSW', tuition: 41000, ttj: 11, pr: 66, be: 29, s1: 47, s2: 56, s3: 66, cost_inr: 4500000 },
  ],
  USA: [
    { name: 'University of Illinois', loc: 'Urbana-Champaign, IL', tuition: 35000, ttj: 8, pr: 28, be: 22, s1: 79, s2: 93, s3: 108, cost_inr: 4980000 },
    { name: 'Northeastern University', loc: 'Boston, MA', tuition: 52000, ttj: 7, pr: 26, be: 20, s1: 81, s2: 98, s3: 115, cost_inr: 6200000 },
    { name: 'Arizona State University', loc: 'Tempe, AZ', tuition: 28000, ttj: 10, pr: 24, be: 25, s1: 73, s2: 87, s3: 101, cost_inr: 4120000 },
    { name: 'Purdue University', loc: 'West Lafayette, IN', tuition: 30000, ttj: 9, pr: 27, be: 23, s1: 76, s2: 90, s3: 105, cost_inr: 4350000 },
  ],
}
