import { ListItemParser } from './list-item.parser';
import { ListItem } from '../../../models';

describe('ListItemParser', () => {

  const PARSER = new ListItemParser();

  it('should parse all units', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ '1 kg Milk',   { name: 'Milk', unit: 'kg',  amount: 1 } ],
      [ '1 KG Milk',   { name: 'Milk', unit: 'kg',  amount: 1 } ],
      [ '1 kG Milk',   { name: 'Milk', unit: 'kg',  amount: 1 } ],
      [ '1 Kg Milk',   { name: 'Milk', unit: 'kg',  amount: 1 } ],
      [ '1 g Milk',    { name: 'Milk', unit: 'g',   amount: 1 } ],
      [ '1 G Milk',    { name: 'Milk', unit: 'g',   amount: 1 } ],
      [ '1 g. Milk',   { name: 'Milk', unit: 'g',   amount: 1 } ],
      [ '1 ml Milk',   { name: 'Milk', unit: 'ml',  amount: 1 } ],
      [ '1 ML Milk',   { name: 'Milk', unit: 'ml',  amount: 1 } ],
      [ '1 Ml Milk',   { name: 'Milk', unit: 'ml',  amount: 1 } ],
      [ '1 mL Milk',   { name: 'Milk', unit: 'ml',  amount: 1 } ],
      [ '1 L Milk',    { name: 'Milk', unit: 'l',   amount: 1 } ],
      [ '1 L. Milk',   { name: 'Milk', unit: 'l',   amount: 1 } ],
      [ '1 l Milk',    { name: 'Milk', unit: 'l',   amount: 1 } ],
      [ '1 stk Milk',  { name: 'Milk', unit: 'stk', amount: 1 } ],
      [ '1 Stk Milk',  { name: 'Milk', unit: 'stk', amount: 1 } ],
      [ '1 stk. Milk', { name: 'Milk', unit: 'stk', amount: 1 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

  it('should parse list items with single names', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ 'Milk',     { name: 'Milk', unit: 'stk', amount: 1 } ],
      [ '1 Milk',   { name: 'Milk', unit: 'stk', amount: 1 } ],
      [ 'L Milk',   { name: 'Milk', unit: 'l',   amount: 1 } ],
      [ '1 L Milk', { name: 'Milk', unit: 'l',   amount: 1 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

  it('should parse list items with multi word names', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ 'Organic Milk',     { name: 'Organic Milk', unit: 'stk', amount: 1 } ],
      [ '1 Organic Milk',   { name: 'Organic Milk', unit: 'stk', amount: 1 } ],
      [ 'L Organic Milk',   { name: 'Organic Milk', unit: 'l',   amount: 1 } ],
      [ '1 L Organic Milk', { name: 'Organic Milk', unit: 'l',   amount: 1 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });

  });

  it('should parse amounts with dot values', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ '1.5 L Milk',         { name: 'Milk',         unit: 'l', amount: 1.5 } ],
      [ '1.5 L Organic Milk', { name: 'Organic Milk', unit: 'l', amount: 1.5 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

  it('should parse amounts with comma values', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ '1,5 L Milk',         { name: 'Milk',         unit: 'l', amount: 1.5 } ],
      [ '1,5 L Organic Milk', { name: 'Organic Milk', unit: 'l', amount: 1.5 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

  it('should parse compounds of unit and amount (e.g. 1L)', () => {
    const INPUT_OUTPUT_PAIRS: [ string, ListItem ][] = [
      [ '1L Milk', { name: 'Milk', unit: 'l', amount: 1 } ],
      [ '1.5L Milk', { name: 'Milk', unit: 'l', amount: 1.5 } ],
      [ '1,5L Milk', { name: 'Milk', unit: 'l', amount: 1.5 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

  it('should ingore numbers within names', () => {
    const INPUT_OUTPUT_PAIRS: [string, ListItem ][] = [
      [ '1 L Milk 3.0 Percent', { name: 'Milk 3.0 Percent', unit: 'l', amount: 1 } ],
      [ 'L 1 Milk 3.0 Percent', { name: 'Milk 3.0 Percent', unit: 'l', amount: 1 } ],
      [ 'L Milk 3.0 Percent',   { name: 'Milk 3.0 Percent', unit: 'l', amount: 1 } ],
      [ '1 Milk 3.0 Percent',   { name: 'Milk 3.0 Percent', unit: 'stk', amount: 1 } ],
    ];

    INPUT_OUTPUT_PAIRS.map(pair => {
      expect(PARSER.parse(pair[0])).toEqual(pair[1]);
    });
  });

});
