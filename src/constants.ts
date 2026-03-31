import { UserProfile, Holiday } from './types';

export const MOCK_EMPLOYEES_DATA = [
  {branch:"Borella",name:"Dahami Divyanjali",joinDate:"2024-06-05",basic:27000,epf:30000,etf:2400,allowances:1000,deductions:4550,net:30150},
  {branch:"Borella",name:"Achini Vindya",joinDate:"2024-02-22",basic:30000,epf:30000,etf:2400,allowances:2000,deductions:3180,net:32780},
  {branch:"Dehiwela",name:"Dilini Sanarathna",joinDate:"2026-03-04",basic:35000,epf:0,etf:0,allowances:0,deductions:2880,net:37880},
  {branch:"Dematagoda",name:"Chamilka Botheju",joinDate:"2002-08-02",basic:32000,epf:30000,etf:2400,allowances:8000,deductions:0,net:37600},
  {branch:"Dematagoda",name:"A.V. Chamika Sonali",joinDate:"2026-01-12",basic:27000,epf:30000,etf:2400,allowances:0,deductions:3360,net:27960},
  {branch:"Homagama",name:"D.A. Dilupa Thamari",joinDate:"2002-09-01",basic:29000,epf:30000,etf:2400,allowances:8000,deductions:0,net:34600},
  {branch:"Homagama",name:"Harsha Thamali",joinDate:"2017-09-01",basic:27000,epf:30000,etf:2400,allowances:3500,deductions:0,net:0},
  {branch:"Kadawatha",name:"Sachini Nirasha",joinDate:"2022-07-01",basic:30000,epf:30000,etf:2400,allowances:1500,deductions:0,net:29100},
  {branch:"Kadawatha",name:"Chaseera Sulani",joinDate:"2024-03-12",basic:27000,epf:30000,etf:2400,allowances:500,deductions:0,net:25100},
  {branch:"Kiribathgoda",name:"Geethangani Pieris",joinDate:"2019-01-09",basic:30000,epf:30000,etf:2400,allowances:3000,deductions:3900,net:24500},
  {branch:"Kiribathgoda",name:"W.k. Eranclathi Perera",joinDate:"2026-02-03",basic:27000,epf:30000,etf:2400,allowances:0,deductions:1440,net:26040},
  {branch:"Kottawa",name:"W.A. Chandima Dilrukishi",joinDate:"2015-01-06",basic:28000,epf:30000,etf:2400,allowances:5000,deductions:0,net:30600},
  {branch:"Kottawa",name:"Rasika Priyangani",joinDate:"2017-02-07",basic:34000,epf:30000,etf:2400,allowances:4000,deductions:1000,net:36600},
  {branch:"Office",name:"A.M.N. Sanjana",joinDate:"1997-03-01",basic:29750,epf:30000,etf:2400,allowances:8000,deductions:0,net:35350},
  {branch:"Office",name:"R.P. Ratnayake",joinDate:"1992-01-01",basic:27500,epf:0,etf:0,allowances:0,deductions:0,net:27500},
  {branch:"Office",name:"Nihal Malawana",joinDate:"1992-01-01",basic:34500,epf:0,etf:0,allowances:0,deductions:10780,net:45280},
  {branch:"Office",name:"Syamalie Udumulla (P/T)",joinDate:"2000-01-01",basic:11000,epf:0,etf:0,allowances:0,deductions:0,net:11000},
  {branch:"Office",name:"Nishanthi Kuruppu",joinDate:"1997-07-10",basic:33200,epf:30000,etf:2400,allowances:8000,deductions:2000,net:40800},
  {branch:"Office",name:"Nadeesha Dilhara",joinDate:"2022-11-10",basic:38000,epf:30000,etf:2400,allowances:1500,deductions:1875,net:38975},
  {branch:"Office",name:"Chathurika Madushani",joinDate:"2026-01-12",basic:27000,epf:30000,etf:2400,allowances:0,deductions:2990,net:27590},
  {branch:"Panadura",name:"Maneesha H. Dias",joinDate:"2016-01-25",basic:35000,epf:30000,etf:2400,allowances:4500,deductions:1620,net:38720},
  {branch:"Panadura",name:"Imashi Pramodaya",joinDate:"2025-11-26",basic:27000,epf:30000,etf:2400,allowances:0,deductions:2025,net:26625},
  {branch:"W2",name:"Aruni Indrachapa",joinDate:"2022-11-03",basic:27000,epf:30000,etf:2400,allowances:1000,deductions:0,net:25600},
  {branch:"W2",name:"Tharushi Sadurnin",joinDate:"2025-12-09",basic:27000,epf:30000,etf:2400,allowances:0,deductions:3000,net:27600},
  {branch:"W3",name:"Lakshika Perera",joinDate:"2017-09-01",basic:27000,epf:30000,etf:2400,allowances:3500,deductions:2000,net:30100},
  {branch:"W3",name:"Tharushi Apsara",joinDate:"2025-07-22",basic:27000,epf:30000,etf:2400,allowances:0,deductions:0,net:24600},
  {branch:"W4",name:"D.M. Nilukshi Kawshalya",joinDate:"2013-01-07",basic:29000,epf:30000,etf:2400,allowances:5500,deductions:4650,net:36750},
  {branch:"W4",name:"Dulki Isanka",joinDate:"2022-04-04",basic:27000,epf:30000,etf:2400,allowances:1500,deductions:0,net:26100}
];

export const HOLIDAYS: Holiday[] = [
  { id: '1', date: '2026-01-01', title: 'New Year\'s Day', type: 'Public' },
  { id: '2', date: '2026-01-14', title: 'Tamil Thai Pongal Day', type: 'Public' },
  { id: '3', date: '2026-02-04', title: 'Independence Day', type: 'Public' },
  { id: '4', date: '2026-04-13', title: 'Sinhala & Tamil New Year Eve', type: 'Public' },
  { id: '5', date: '2026-04-14', title: 'Sinhala & Tamil New Year Day', type: 'Public' },
  { id: '6', date: '2026-05-01', title: 'May Day', type: 'Public' },
  { id: '7', date: '2026-12-25', title: 'Christmas Day', type: 'Public' },
];
