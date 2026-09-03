package com.hiero.ecom.core.filters;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;

@Component(
    metatype = true,
    label = "Hiero eCommerce Logging Filter",
    description = "Logs HTTP request and response details with performance metrics"
)
@Service(Filter.class)
@org.apache.felix.scr.annotations.Property(
    name = EngineConstants.SLING_FILTER_SCOPE,
    value = EngineConstants.FILTER_SCOPE_REQUEST
)
@org.apache.felix.scr.annotations.Property(
    name = Constants.SERVICE_RANKING,
    intValue = 50
)
public class LoggingFilter implements Filter {
    
    private static final Logger LOG = LoggerFactory.getLogger(LoggingFilter.class);
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.debug("LoggingFilter initialized");
    }
    
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        
        if (!(request instanceof SlingHttpServletRequest)) {
            chain.doFilter(request, response);
            return;
        }
        
        SlingHttpServletRequest slingRequest = (SlingHttpServletRequest) request;
        SlingHttpServletResponse slingResponse = (SlingHttpServletResponse) response;
        long startTime = System.currentTimeMillis();
        
        try {
            chain.doFilter(request, response);
        } finally {
            long duration = System.currentTimeMillis() - startTime;
            LOG.info("HTTP {} {} | Status: {} | Duration: {}ms",
                    slingRequest.getMethod(),
                    slingRequest.getRequestURI(),
                    slingResponse.getStatus(),
                    duration);
        }
    }
    
    @Override
    public void destroy() {
        LOG.debug("LoggingFilter destroyed");
    }
}
