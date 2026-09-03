package com.hiero.ecom.core.models;

import org.apache.sling.api.resource.Resource;
import org.apache.sling.models.annotations.Model;
import org.apache.sling.models.annotations.injectorspecific.ValueMapValue;

import java.util.ArrayList;
import java.util.List;
import java.util.Calendar;

@Model(adaptables = Resource.class)
public class FooterModel {

    @ValueMapValue(name = "companyName")
    private String companyName = "Our Store";

    @ValueMapValue(name = "showSocialLinks")
    private boolean showSocialLinks = true;

    public String getCompanyName() {
        return companyName;
    }

    public boolean isShowSocialLinks() {
        return showSocialLinks;
    }

    public int getCurrentYear() {
        return Calendar.getInstance().get(Calendar.YEAR);
    }

    public List<FooterGroup> getFooterGroups() {
        List<FooterGroup> groups = new ArrayList<>();
        
        List<FooterItem> productItems = new ArrayList<>();
        productItems.add(new FooterItem("New Arrivals", "/products/new", "New arrivals"));
        productItems.add(new FooterItem("Best Sellers", "/products/bestsellers", "Best selling products"));
        productItems.add(new FooterItem("Sale", "/products/sale", "Sale items"));
        groups.add(new FooterGroup("Products", productItems));

        List<FooterItem> helpItems = new ArrayList<>();
        helpItems.add(new FooterItem("Help Center", "/help", "Help center"));
        helpItems.add(new FooterItem("Shipping Info", "/shipping", "Shipping information"));
        helpItems.add(new FooterItem("Returns", "/returns", "Return policy"));
        helpItems.add(new FooterItem("FAQ", "/faq", "Frequently asked questions"));
        groups.add(new FooterGroup("Help", helpItems));

        List<FooterItem> companyItems = new ArrayList<>();
        companyItems.add(new FooterItem("About Us", "/about", "About our company"));
        companyItems.add(new FooterItem("Contact", "/contact", "Contact us"));
        companyItems.add(new FooterItem("Careers", "/careers", "Career opportunities"));
        groups.add(new FooterGroup("Company", companyItems));

        return groups;
    }

    public List<SocialLink> getSocialLinks() {
        List<SocialLink> links = new ArrayList<>();
        links.add(new SocialLink("Facebook", "https://facebook.com", "f"));
        links.add(new SocialLink("Twitter", "https://twitter.com", "𝕏"));
        links.add(new SocialLink("Instagram", "https://instagram.com", "📷"));
        links.add(new SocialLink("LinkedIn", "https://linkedin.com", "in"));
        return links;
    }

    public static class FooterGroup {
        private String title;
        private List<FooterItem> items;

        public FooterGroup(String title, List<FooterItem> items) {
            this.title = title;
            this.items = items;
        }

        public String getTitle() {
            return title;
        }

        public List<FooterItem> getItems() {
            return items;
        }
    }

    public static class FooterItem {
        private String label;
        private String href;
        private String ariaLabel;

        public FooterItem(String label, String href, String ariaLabel) {
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

    public static class SocialLink {
        private String label;
        private String url;
        private String icon;

        public SocialLink(String label, String url, String icon) {
            this.label = label;
            this.url = url;
            this.icon = icon;
        }

        public String getLabel() {
            return label;
        }

        public String getUrl() {
            return url;
        }

        public String getIcon() {
            return icon;
        }
    }
}
