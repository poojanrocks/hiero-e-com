package com.hiero.ecom.core.filters;

import com.hiero.ecom.core.correlation.RequestCorrelationFilter;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.EngineConstants;
import org.apache.sling.servlets.annotations.SlingServletFilter;
import org.osgi.service.component.annotations.Component;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component(service = Filter.class, property = {
    EngineConstants.SLING_FILTER_SCOPE + "=" + EngineConstants.FILTER_SCOPE_REQUEST,
    EngineConstants.SLING_FILTER_ORDER + "=" + Integer.MIN_VALUE + 101
})
public class LoggingFilter implements Filter {
    private static final Logger LOG = LoggerFactory.getLogger(LoggingFilter.class);

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        if (request instanceof HttpServletRequest && response instanceof HttpServletResponse) {
            HttpServletRequest httpRequest = (HttpServletRequest) request;
            HttpServletResponse httpResponse = (HttpServletResponse) response;
            String correlationId = RequestCorrelationFilter.getCurrentCorrelationId();
            long startTime = System.currentTimeMillis();

            try {
                String method = httpRequest.getMethod();
                String requestUri = httpRequest.getRequestURI();
                LOG.info("Incoming request [{}] {} {} [correlationId={}]",
                    method, requestUri, httpRequest.getQueryString(), correlationId);

                chain.doFilter(request, response);

                long duration = System.currentTimeMillis() - startTime;
                int status = httpResponse.getStatus();
                LOG.info("Request completed [{}] {} - Status: {} - Duration: {}ms [correlationId={}]",
                    method, requestUri, status, duration, correlationId);
            } catch (Exception e) {
                long duration = System.currentTimeMillis() - startTime;
                LOG.error("Request failed [{}] {} after {}ms [correlationId={}] - {}",
                    httpRequest.getMethod(), httpRequest.getRequestURI(), duration, correlationId,
                    e.getMessage(), e);
                throw e;
            }
        } else {
            chain.doFilter(request, response);
        }
    }
}
