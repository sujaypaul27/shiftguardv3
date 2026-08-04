package com.shiftguard.app.solver;

public class ValidationResult {
    private boolean valid;
    private String violatedRule;
    private String message;

    public ValidationResult() {}

    public ValidationResult(boolean valid, String violatedRule, String message) {
        this.valid = valid;
        this.violatedRule = violatedRule;
        this.message = message;
    }

    public boolean isValid() {
        return valid;
    }

    public void setValid(boolean valid) {
        this.valid = valid;
    }

    public String getViolatedRule() {
        return violatedRule;
    }

    public void setViolatedRule(String violatedRule) {
        this.violatedRule = violatedRule;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }
}