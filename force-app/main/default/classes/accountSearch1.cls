public with sharing class accountSearch1 {
    @AuraEnabled(cacheable=true)
    public static List<Account> getAccounts(List<AccountFilter> filters) {
        system.debug('filters=>'+filters);
                
            
                
                List<String> filterConditions = new List<String>();
        
                for (AccountFilter filter : filters) {
                    if (String.isNotBlank(filter.fieldName) && String.isNotBlank(filter.operator) && String.isNotBlank(filter.value)) {
                        String filOperator;
                        String filValue;
        
        
                        if (filter.operator.equals('STARTSWITH')) {
                            filOperator = 'LIKE';
                            filValue = filter.value + '%';
                        } else if (filter.operator.equals('ENDSWITH')) {
                            filOperator = 'LIKE';
                            filValue = '%' + filter.value;
                        } else if(filter.operator.equals('LIKE')){
                            // Default to 'Contains' if operator is 'LIKE' but not 'StartsWith' or 'EndsWith'
                            filOperator = 'LIKE';
                            filValue = '%' + filter.value + '%';
                        }else {
                            filOperator = filter.operator;
                            filValue = filter.value;
                        }
                     
                String dataType = determineDataType(filter.value); // Determine the data type of the value

                filterConditions.add(constructFilterCondition(filter.fieldName, filOperator, filValue, dataType));
                    }
                }
        
                String query = 'SELECT Name, Industry, Type, Phone FROM Account';
                if (!filterConditions.isEmpty()) {
                    query += ' WHERE ' + String.join(filterConditions, ' AND ');
                    system.debug('query=>'+query);

                }
                system.debug('ABC=>'+ Database.query(query));
                return Database.query(query);
            }
            private static String determineDataType(String value) {
                if (isNumeric(value)) {
                    return 'Number';
                } else if (isBoolean(value)) {
                    return 'Boolean';
                } else  {
                    return 'String';
                }
            }
        
            private static Boolean isNumeric(String value) {
                try {
                    Double.valueOf(value);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        
            private static Boolean isBoolean(String value) {
                return value.equalsIgnoreCase('true') || value.equalsIgnoreCase('false');
            }
        
            private static String constructFilterCondition(String fieldName, String operator, String value, String dataType) {
                if (dataType.equals('Number')) {
                    return fieldName + ' ' + operator + ' ' + value;
                } else if (dataType.equals('Boolean')) {
                    return fieldName + ' = ' + (value.equalsIgnoreCase('true') ? 'true' : 'false');
                } else {
                    return fieldName + ' ' + operator + ' \'' + value + '\'';
                }
            }
             
    public class AccountFilter {
        @AuraEnabled public String fieldName{get; set;}
        @AuraEnabled public String operator{get; set;}
        @AuraEnabled public String value{get; set;}
    }
    
    
    @AuraEnabled(cacheable=true) 
    public static List<FieldOption> getAccountfields() {
        List<FieldOption> fieldOptions = new List<FieldOption>();

        Schema.SObjectType accountType = Schema.getGlobalDescribe().get('Account');
        if (accountType != null) {
            Schema.DescribeSObjectResult accountDescribe = accountType.getDescribe();
            Map<String, Schema.SObjectField> fieldsMap = accountDescribe.fields.getMap();

            for (String fieldName : fieldsMap.keySet()) {
                Schema.DescribeFieldResult fieldDescribe = fieldsMap.get(fieldName).getDescribe();
                fieldOptions.add(new FieldOption(fieldDescribe.getLabel(), fieldName, fieldDescribe.getType().name()));
            }
        }

        return fieldOptions;
    }
    public class FieldOption {
        @AuraEnabled public String label;
        @AuraEnabled public String value;
        @AuraEnabled public String dataType;

        public FieldOption(String label, String value, String dataType) {
            this.label = label;
            this.value = value;
            this.dataType = dataType;
        }
    }
    @AuraEnabled
    public static List<Map<String, String>> getOperatorsFields(String operate) {
        system.debug('operate'+operate);
        List<Map<String, String>> operatorFields = new List<Map<String, String>>();

        if (operate == 'ACCOUNT NAME'  ) {
            operatorFields.add(new Map<String, String>{'label' => 'Contains', 'value' => 'LIKE'});
            operatorFields.add(new Map<String, String>{'label' => 'Starts With', 'value' => 'STARTSWITH'});
            operatorFields.add(new Map<String, String>{'label' => 'Ends With', 'value' => 'ENDSWITH'});
        } else {
            operatorFields.add(new Map<String, String>{'label' => 'Equals', 'value' => '='});
            operatorFields.add(new Map<String, String>{'label' => 'Not Equals to', 'value' => '!='});
            operatorFields.add(new Map<String, String>{'label' => 'less than', 'value' => '<'});
            operatorFields.add(new Map<String, String>{'label' => 'greater than', 'value' => '>'});
            operatorFields.add(new Map<String, String>{'label' => 'less or equal', 'value' => '<='});
            operatorFields.add(new Map<String, String>{'label' => 'greater or equal', 'value' => '>='});
        }

        return operatorFields;
}
}