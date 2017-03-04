/**
 * PEG.js Grammar for Shopping List Entries
 */

Start
  = u:Unit ' '* a:Amount ' '* n:Name { return { name: n, unit: u,     amount: a }; }
  / a:Amount ' '* u:Unit ' '* n:Name { return { name: n, unit: u,     amount: a }; }
  / a:Amount ' '* 'x' ' '* n:Name    { return { name: n, unit: 'stk', amount: a }; }
  / a:Amount ' '* n:Name             { return { name: n, unit: 'stk', amount: a }; }
  / u:Unit ' '* n:Name               { return { name: n, unit: u,     amount: 1 }; }
  / n:Name                           { return { name: n, unit: 'stk', amount: 1 }; }

// The following rules have an issue with the greedy parsing since Unit is always assumed part of Name
  // / n:Name ' '* u:Unit ' '* a:Amount { return { name: n, unit: u,     amount: a }; }
  // / n:Name ' '* a:Amount ' '* u:Unit { return { name: n, unit: u,     amount: a }; }
  // / n:Name ' '* a:Amount             { return { name: n, unit: 'stk', amount: a }; }
  // / n:Name ' '* u:Unit               { return { name: n, unit: u,     amount: 1 }; }

Unit
  = 'stk'i'.'? { return 'stk'; }
  / 'kg'i'.'?  { return 'kg';  }
  / 'g'i'.'?   { return 'g';   }
  / 'L'i'.'?   { return 'l';   }
  / 'ml'i'.'?  { return 'ml';  }

Amount
  = amountNumber:[0-9.,]+ { return parseFloat(amountNumber.join('').replace(/,/g, '.')); }

Name
  = any:.+ { return any.join('').replace(/\s/g, ' ').trim(); }
