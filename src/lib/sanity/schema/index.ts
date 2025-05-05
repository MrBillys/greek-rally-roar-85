// Import all schema types
import rally from './rally';
import stage from './stage';
import driver from './driver';
import coDriver from './coDriver';
import car from './car';
import team from './team';
import entry from './entry';
import rallyResult from './rallyResult';
import stageResult from './stageResult';
import retirement from './retirement';
import overallStanding from './overallStanding';
import championship from './championship';
import onboardLink from './onboardLink';
import penalty from './penalty';

// Export as a named export 'schemaTypes' for Sanity to use
export const schemaTypes = [
  // Document types
  rally,
  stage,
  driver,
  coDriver,
  car,
  team,
  entry,
  rallyResult,
  stageResult,
  retirement,
  overallStanding,
  championship,
  onboardLink,
  penalty,
];

// Also keep the default export for backward compatibility
export default schemaTypes;
