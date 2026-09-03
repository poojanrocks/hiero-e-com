package com.hiero.ecom.core.correlation;

import org.apache.felix.scr.annotations.Component;
import org.apache.felix.scr.annotations.Service;
import org.apache.sling.api.SlingHttpServletRequest;
import org.apache.sling.api.SlingHttpServletResponse;
import org.apache.sling.engine.EngineConstants;
import org.osgi.framework.Constants;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.slf4j.MDC;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import java.io.IOException;
import java.util.UUID;

@Component(
    metatype = true,
    label = "Request Correlation Filter",
    description = "Adds request correlation IDs for distributed tracing"
)
@Service(Filter.class)
@org.apache.felix.scr.annotations.Property(
    name = EngineConstants.SLING_FILTER_SCOPE,
    value = EngineConstants.FILTER_SCOPE_REQUEST
)
@org.apache.felix.scr.annotations.Property(
    name = Constants.SERVICE_RANKING,
    intValue = 100
)
public class RequestCorrelationFilter implements Filter {
    
    private static final Logger LOG = LoggerFactory.getLogger(RequestCorrelationFilter.class);
    private static final String CORRELATION_ID_HEADER = "X-Correlation-ID";
    private static final String CORRELATION_ID_MDC = "correlationId";
    
    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        LOG.debug("RequestCorrelationFilter initialized");
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
        
        String correlationId = slingRequest.getHeader(CORRELATION_ID_HEADER);
        if (correlationId == null || correlationId.isEmpty()) {
            correlationId = UUID.randomUUID().toString();
        }
        
        MDC.put(CORRELATION_ID_MDC, correlationId);
        slingResponse.setHeader(CORRELATION_ID_HEADER, correlationId);
        
        try {
            chain.doFilter(request, response);
        } finally {
            MDC.remove(CORRELATION_ID_MDC);
        }
    }
    
    @Override
    public void destroy() {
        LOG.debug("RequestCorrelationFilter destroyed");
    }
}
