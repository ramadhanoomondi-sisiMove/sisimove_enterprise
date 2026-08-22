export const COMMERCIAL_COMMISSION_RULE_TOKENS = {
  REPOSITORY: Symbol('CommercialCommissionRuleRepository'),

  COMMAND_HANDLERS: {
    CREATE: Symbol('CreateCommercialCommissionRuleHandler'),
    ACTIVATE: Symbol('ActivateCommercialCommissionRuleHandler'),
    DEACTIVATE: Symbol('DeactivateCommercialCommissionRuleHandler'),
    UPDATE: Symbol('UpdateCommercialCommissionRuleHandler'),
  } as const,

  QUERY_HANDLERS: {
    GET: Symbol('GetCommercialCommissionRuleHandler'),
    GET_BY_TYPE: Symbol('GetCommercialCommissionRuleByTypeHandler'),
    GET_ACTIVE: Symbol('GetActiveCommercialCommissionRuleHandler'),
    LIST: Symbol('ListCommercialCommissionRulesHandler'),
  } as const,
} as const;
