# Change log

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->
## 1.0.0a17 (2025-08-26)

### Backend


#### Bug fixes:

- Fixed person images for search block. Update to VLT 7a24. @sneridagh 



### Frontend

#### Bugfix

- Fixed person images for search block. Update to VLT 7a24. @sneridagh 



### Project

No significant changes.




## 1.0.0a16 (2025-08-25)

### Backend


#### New features:

- Update to Volto 18.24.0 and VLT 7a23. @sneridagh [#36](https://github.com/kitconcept/kitconcept-core/issues/36)



### Frontend

#### Feature

- Update to Volto 18.24.0 and VLT 7a23. @sneridagh [#36](https://github.com/kitconcept/kitconcept-core/issue/36)



### Project

No significant changes.




## 1.0.0a15 (2025-07-25)

### Backend


#### Internal:

- Update to VLT 7a19 @sneridagh 



### Frontend

#### Internal

- Update to VLT 7a19 @sneridagh 



### Project

No significant changes.




## 1.0.0a14 (2025-07-23)

### Backend

No significant changes.




### Frontend

#### Internal

- Revert #31 @sneridagh [#32](https://github.com/kitconcept/kitconcept-core/issue/32)
- Update to VLT 7a18. @sneridagh 



### Project

No significant changes.




## 1.0.0a13 (2025-07-17)

### Backend


#### Internal:

- Update VLT 7a15. @sneridagh 



### Frontend

#### Internal

- Update VLT 7a15. @sneridagh 



### Project

No significant changes.




## 1.0.0a12 (2025-07-10)

### Backend


#### Internal:

- Added new event calendar block.
  Added `footer_main_logo_inversed` image field to kitconcept.footer behavior, and related frontend code.
  Several fixes.
  Update to VLT 7a14. @sneridagh 



### Frontend

#### Internal

- Added new event calendar block.
  Added `footer_main_logo_inversed` image field to kitconcept.footer behavior, and related frontend code.
  Several fixes.
  Update to VLT 7a14. @sneridagh 



### Project

No significant changes.




## 1.0.0a11 (2025-06-18)

### Backend


#### Bug fixes:

- Update to use VLT 7a13. @sneridagh 



### Frontend

#### Bugfix

- Fixed default `selectedItemAttrs` for Teaser to include Person specific attributes. @sneridagh
  Update to use VLT 7a13. 



### Project

No significant changes.




## 1.0.0a10 (2025-06-18)

### Backend


#### Internal:

- Update to VLT 7a12. @sneridagh 



### Frontend

#### Feature

- Add `volto-carousel-block` and `volto-logos-block` as addons. @jnptk 

#### Internal

- Update to VLT 7a12. Fixes several CSS issues with persons variants. @sneridagh 



### Project

No significant changes.




## 1.0.0a9 (2025-06-13)

### Backend


#### Bug fixes:

- Bring back Barceloneta Theme to ClassicUI. @sneridagh 


#### Internal:

- Update Volto 18.23.0 and VLT 7a11. @sneridagh 



### Frontend

#### Internal

- Update Volto 18.23.0 and VLT 7a11. @sneridagh 



### Project

No significant changes.




## 1.0.0a8 (2025-06-10)

### Backend


#### Internal:

- Update to VLT 7a10. Fixes CSS styling Person Teaser top. @sneridagh 



### Frontend

#### Internal

- Update to VLT 7a10. Fixes CSS styling Person Teaser top. @sneridagh 



### Project

No significant changes.




## 1.0.0a7 (2025-06-09)

### Backend


#### Internal:

- Update to VLT 7a9. @sneridagh 



### Frontend

#### Internal

- Update to VLT 7a9 - Fixed Person Teaser CSS.  @sneridagh 



### Project

No significant changes.




## 1.0.0a6 (2025-06-06)

### Backend


#### Breaking changes:

- Use VLT 7a6. @sneridagh 


#### Internal:

- Improved tests checking the position of the behavior. @sneridagh 
- Use VLT 7a8. @sneridagh 



### Frontend

#### Breaking

- Use VLT 7a6. @sneridagh 

#### Internal

- Update volto-authomatic 3.0.0-alpha.3. Fixed CSS in login form. @sneridagh 
- Use VLT 7a8. @sneridagh 



### Project

No significant changes.




## 1.0.0a5 (2025-05-23)

### Backend


#### New features:

- Added c.person as dependency, move person related things from k.intranet. @sneridagh [#13](https://github.com/kitconcept/kitconcept-core/issues/13)


#### Internal:

- Update to VLT 6.1.0. @sneridagh 



### Frontend

#### Feature

- Customize UpgradeControlPanel to use our VersionOverview component. @ericof 

#### Bugfix

- Fixed the color in links in slate block in edit mode. @sneridagh 



### Project

No significant changes.




## 1.0.0a4 (2025-05-16)

### Backend


#### Bug fixes:

- Fix migration tool exception access without a site hook being set. @ericof [#11](https://github.com/kitconcept/kitconcept-core/issues/11)



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a3 (2025-05-15)

### Backend


#### Internal:

- Explicitly add all content types to our generic setup profile. @sneridagh 
- Refactor site creation function to use three distinct profiles: base, cmfdependencies and dependencies. The later one is responsible for installing, on first run, the add-on dependencies for kitconcept.core. @ericof 
- Upgrade kitconcept.voltolighttheme to version 6.0.1 @sneridagh 
- Upgrade plone.volto to version 5.1.0 @ericof 


#### Tests

- Add FTI tests for all content types. @ericof 
- Create a testing distribution to be used in internal tests. @ericof 



### Frontend

#### Feature

- Update @kitconcept/volto-light-theme to version 6.0.1 @sneridagh 

#### Bugfix

- Set `config.settings.supportedLanguages` to 'en' and 'de'. @sneridagh 

#### Internal

- Set `filterBlobs` to true in mrs.developer.json. @sneridagh 



### Project

No significant changes.




## 1.0.0a2 (2025-05-13)

### Backend


#### New features:

- Upgrade plone.restapi to version 9.14.0 @ericof [#6](https://github.com/kitconcept/kitconcept-core/issues/6)


#### Internal:

- Remove old portlets registration -- but keep portlet managers (as they are required by other packages). @ericof [#3](https://github.com/kitconcept/kitconcept-core/issues/3)
- Pin Python to version 3.12 in pyproject.toml. @ericof [#4](https://github.com/kitconcept/kitconcept-core/issues/4)



### Frontend

#### Feature

- Upgrade @plone/volto to version 18.20.0. @ericof 

#### Internal

- Rename packages/core to packages/kitconcept-core to avoid confusion with Volto core checkout. @ericof [#5](https://github.com/kitconcept/kitconcept-core/issue/5)



### Project

No significant changes.




## 1.0.0a1 (2025-05-09)

### Backend


#### New features:

- Add collective.volto.formsupport / collective.honeypot as dependencies. @ericof 
- Add kitconcept.voltolighttheme as dependency. @ericof 
- Add plonegovbr.socialmedia as dependency. @ericof 



### Frontend

#### Feature

- Add @kitconcept/volto-light-theme as dependency. @ericof 
- Add @plonegovbr/socialmedia as dependency. @ericof 
- Add volto-form-block as dependency. @ericof 
- Use @plone/volto version 18.19.0 @ericof 



### Project

No significant changes.




