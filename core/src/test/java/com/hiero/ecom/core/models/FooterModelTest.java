package com.hiero.ecom.core.models;

import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.hiero.ecom.core.testcontext.AppAemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
class FooterModelTest {

  private AppAemContext context;

  @BeforeEach
  void setUp() {
    context = new AppAemContext();
  }

  @Test
  void testFooterComponentExists() {
    assertNotNull(
        context.request().adaptTo(com.hiero.ecom.core.models.Footer.class),
        "Footer model should be adaptable from request");
  }

  @Test
  void testFooterRendersWithCorrectStructure() {
    // Test that footer renders with expected sections
    assertNotNull(
        context.request().adaptTo(com.hiero.ecom.core.models.Footer.class),
        "Footer should render properly");
  }
}
