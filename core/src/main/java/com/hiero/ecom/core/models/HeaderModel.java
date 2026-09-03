package com.hiero.ecom.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;
import com.day.cq.dam.api.Asset;

import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

@Model(adaptables = Resource.class)
public class HeaderModel {

    @ValueMapValue(name = "logoText")
    private String logoText = "Store";

    @ValueMapValue(name = "logoLink")
    private String logoLink = "/";

    @ValueMapValue(name = "cartCount")
    private int cartCount = 0;

    @ValueMapValue(name = "wishlistCount")
    private int wishlistCount = 0;

    public String getLogoText() {
        return logoText;
    }

    public String getLogoLink() {
        return logoLink;
    }

    public int getCartCount() {
        return cartCount;
    }

    public int getWishlistCount() {
        return wishlistCount;
    }

    public List<NavigationItem> getNavigationItems() {
        List<NavigationItem> items = new ArrayList<>();
        items.add(new NavigationItem("Home", "/", "Home page"));
        items.add(new NavigationItem("Products", "/products", "View all products"));
        items.add(new NavigationItem("About", "/about", "About us"));
        items.add(new NavigationItem("Contact", "/contact", "Contact us"));
        return items;
    }

    public static class NavigationItem {
        private String label;
        private String href;
        private String ariaLabel;

        public NavigationItem(String label, String href, String ariaLabel) {
            this.label = label;
            this.href = href;
            this.ariaLabel = ariaLabel;
        }

        public String getLabel() {
            return label;
        }

        public String getHref() {
            return href;
        }

        public String getAriaLabel() {
            return ariaLabel;
        }
    }
}
