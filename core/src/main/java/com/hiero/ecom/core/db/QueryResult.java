package com.hiero.ecom.core.db;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class QueryResult {
    private List<Map<String, Object>> rows;
    private int rowCount;
    private boolean success;
    private String errorMessage;

    private QueryResult(Builder builder) {
        this.rows = builder.rows;
        this.rowCount = builder.rowCount;
        this.success = builder.success;
        this.errorMessage = builder.errorMessage;
    }

    public List<Map<String, Object>> getRows() {
        return rows;
    }

    public int getRowCount() {
        return rowCount;
    }

    public boolean isSuccess() {
        return success;
    }

    public boolean isEmpty() {
        return rows == null || rows.isEmpty();
    }

    public String getErrorMessage() {
        return errorMessage;
    }

    public static class Builder {
        private List<Map<String, Object>> rows = new ArrayList<>();
        private int rowCount = 0;
        private boolean success = true;
        private String errorMessage = null;

        public Builder addRow(Map<String, Object> row) {
            this.rows.add(row);
            this.rowCount++;
            return this;
        }

        public Builder withRows(List<Map<String, Object>> rows) {
            this.rows = rows;
            this.rowCount = rows.size();
            return this;
        }

        public Builder withRowCount(int count) {
            this.rowCount = count;
            return this;
        }

        public Builder success() {
            this.success = true;
            this.errorMessage = null;
            return this;
        }

        public Builder failure(String errorMessage) {
            this.success = false;
            this.errorMessage = errorMessage;
            return this;
        }

        public QueryResult build() {
            return new QueryResult(this);
        }
    }
}
