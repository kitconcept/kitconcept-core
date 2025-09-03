# Changelog

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->

## 1.0.0-alpha.20 (2025-09-03)

### Internal

- Due to a problem with the last release, re-releasing. @sneridagh 

## 1.0.0-alpha.19 (2025-09-03)

### Feature

- Update to Volto 18.25.0 @sneridagh 

## 1.0.0-alpha.18 (2025-09-01)

### Bugfix

- Several VLT bugfixes. Update to VLT 7a25. @sneridagh 

## 1.0.0-alpha.17 (2025-08-26)

### Bugfix

- Fixed person images for search block. Update to VLT 7a24. @sneridagh 

## 1.0.0-alpha.16 (2025-08-25)

### Feature

- Update to Volto 18.24.0 and VLT 7a23. @sneridagh [#36](https://github.com/kitconcept/kitconcept-core/issue/36)

## 1.0.0-alpha.15 (2025-07-25)

### Internal

- Update to VLT 7a19 @sneridagh 

## 1.0.0-alpha.14 (2025-07-23)

### Internal

- Revert #31 @sneridagh [#32](https://github.com/kitconcept/kitconcept-core/issue/32)
- Update to VLT 7a18. @sneridagh 

## 1.0.0-alpha.13 (2025-07-17)

### Internal

- Update VLT 7a15. @sneridagh 

## 1.0.0-alpha.12 (2025-07-10)

### Internal

- Added new event calendar block.
  Added `footer_main_logo_inversed` image field to kitconcept.footer behavior, and related frontend code.
  Several fixes.
  Update to VLT 7a14. @sneridagh 

## 1.0.0-alpha.11 (2025-06-18)

### Bugfix

- Fixed default `selectedItemAttrs` for Teaser to include Person specific attributes. @sneridagh
  Update to use VLT 7a13. 

## 1.0.0-alpha.10 (2025-06-18)

### Feature

- Add `volto-carousel-block` and `volto-logos-block` as addons. @jnptk 

### Internal

- Update to VLT 7a12. Fixes several CSS issues with persons variants. @sneridagh 

## 1.0.0-alpha.9 (2025-06-13)

### Internal

- Update Volto 18.23.0 and VLT 7a11. @sneridagh 

## 1.0.0-alpha.8 (2025-06-10)

### Internal

- Update to VLT 7a10. Fixes CSS styling Person Teaser top. @sneridagh 

## 1.0.0-alpha.7 (2025-06-09)

### Internal

- Update to VLT 7a9 - Fixed Person Teaser CSS.  @sneridagh 

## 1.0.0-alpha.6 (2025-06-06)

### Breaking

- Use VLT 7a6. @sneridagh 

### Internal

- Update volto-authomatic 3.0.0-alpha.3. Fixed CSS in login form. @sneridagh 
- Use VLT 7a8. @sneridagh 

## 1.0.0-alpha.5 (2025-05-23)

### Feature

- Customize UpgradeControlPanel to use our VersionOverview component. @ericof 

### Bugfix

- Fixed the color in links in slate block in edit mode. @sneridagh 

## 1.0.0-alpha.4 (2025-05-16)

## 1.0.0-alpha.3 (2025-05-15)

### Feature

- Update @kitconcept/volto-light-theme to version 6.0.1 @sneridagh 

### Bugfix

- Set `config.settings.supportedLanguages` to 'en' and 'de'. @sneridagh 

### Internal

- Set `filterBlobs` to true in mrs.developer.json. @sneridagh 

## 1.0.0-alpha.2 (2025-05-13)

### Feature

- Upgrade @plone/volto to version 18.20.0. @ericof 

### Internal

- Rename packages/core to packages/kitconcept-core to avoid confusion with Volto core checkout. @ericof [#5](https://github.com/kitconcept/kitconcept-core/issue/5)

## 1.0.0-alpha.1 (2025-05-09)

### Feature

- Add @kitconcept/volto-light-theme as dependency. @ericof 
- Add @plonegovbr/socialmedia as dependency. @ericof 
- Add volto-form-block as dependency. @ericof 
- Use @plone/volto version 18.19.0 @ericof
