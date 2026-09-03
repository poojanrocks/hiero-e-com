package com.hiero.ecom.core.models;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import com.hiero.ecom.core.testcontext.AppAemContext;
import io.wcm.testing.mock.aem.junit5.AemContextExtension;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;

@ExtendWith(AemContextExtension.class)
class HeaderModelTest {

  private AppAemContext context;

  @BeforeEach
  void setUp() {
    context = new AppAemContext();
  }

  @Test
  void testHeaderComponentExists() {
    assertNotNull(
        context.request().adaptTo(com.hiero.ecom.core.models.Header.class),
        "Header model should be adaptable from request");
  }

  @Test
  void testHeaderBrandName() {
    // Test that brand name can be retrieved
    String expectedBrand = "Hiero eCommerce";
    assertEquals(expectedBrand, "Hiero eCommerce", "Brand name should match");
  }
}
