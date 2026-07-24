# Change log

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->
## 2.0.0b6 (2026-07-24)

### Backend

No significant changes.




### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0b5 (2026-07-24)

### Backend


#### Bug fixes:

- Use "clickable_profile_link' instead of 'disable_profile_link' @Tishasoumya-02 


#### Tests

- Upgrade `pytest-plone` to version 1.1.0 and re-parent the acceptance remote-library bundle onto the kitconcept fixture, avoiding a duplicate Plone site under the new `keep_session` default. @ericof [#462](https://github.com/kitconcept/kitconcept-core/issues/462)



### Frontend

#### Bugfix

- Fix the size of i icon in toast @Tishasoumya-02 



### Project


#### Internal

- Updated documentation build to Python 3.14 and dropped the unused `sphinxcontrib-httpdomain`/`sphinxcontrib-httpexample` extensions (and the `setuptools` workaround they required). @ericof 


#### Documentation

- Update docs for clickable profile link control panel setting @Tishasoumya-02 



## 2.0.0b4 (2026-07-07)

### Backend


#### New features:

- Hid all add-ons managed by our package. @ericof 


#### Bug fixes:

- Added missing upgrade step from 20260620001 to 20260701001 and added upgrade tests. @ericof 


#### Internal:

- Bumped `plone.formblock` to `>=1.0.0a3`. @ericof [#452](https://github.com/kitconcept/kitconcept-core/issues/452)



### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0b3 (2026-07-06)

### Backend


#### New features:

- `create_site` now accepts a list of browser-layer interfaces and can install additional Generic Setup profiles during site creation. @ericof [#441](https://github.com/kitconcept/kitconcept-core/issues/441)


#### Documentation:

- Rewrote the docstrings of the `utils.scripts` site-creation helpers in reStructuredText. @ericof [#441](https://github.com/kitconcept/kitconcept-core/issues/441)


#### Tests

- Expanded test coverage for the site-creation script helpers, including an end-to-end `create_site` test. @ericof [#441](https://github.com/kitconcept/kitconcept-core/issues/441)



### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0b2 (2026-07-01)

### Backend


#### New features:

- Support Python 3.14. @ericof [#434](https://github.com/kitconcept/kitconcept-core/issues/434)
- Upgrade Products.CMFPlone to 6.2.1. @ericof [#435](https://github.com/kitconcept/kitconcept-core/issues/435)
- Add site-creation script helpers that read answers from environment variables, shared from the website and intranet distributions. @ericof [#436](https://github.com/kitconcept/kitconcept-core/issues/436)
- Upgrade collective.person to 1.0.0b6. @ericof 
- Upgrade kitconcept.voltolighttheme to 8.0.0a30. @ericof 
- Use `plone/server-builder:uv` base images and clean up the container skeleton. @ericof 


#### Internal:

- Remove `.python-version` and update `.gitignore`. @ericof 



### Frontend

No significant changes.


### Project


#### Internal

- Bump Python version to 3.14 on GitHub Actions. @ericof [#434](https://github.com/kitconcept/kitconcept-core/pull/434)



## 2.0.0b1 (2026-06-23)

### Backend


#### New features:

- Add plone.formblock dependency and uninstall collective.volto.formsupport. @ericof [#246](https://github.com/kitconcept/kitconcept-core/issues/246)
- Upgrade to Plone 6.2.0. @sneridagh [#387](https://github.com/kitconcept/kitconcept-core/issues/387)
- Added authentication support during site creation, with providers for Keycloak, OIDC, and Authomatic (GitHub and Google). @ericof [#414](https://github.com/kitconcept/kitconcept-core/issues/414)
- Added a `multilingual` Generic Setup profile and moved the LRF (Language Root Folder) type into it, so downstream projects no longer need to ship this configuration themselves. @ericof 
- Added reusable distribution `pre_handler`/`handler`/`post_handler` and site-creation utilities, removing the need for downstream projects to duplicate them. @ericof 


#### Internal:

- Fixed a typo in the `move_rename_object` script docstring and refreshed the i18n locale files. @ericof 
- The package now uses native namespaces. @ericof 
- Update pytest-plone to version 1.0.0. @ericof 


#### Tests

- Reworked the test fixtures to create the site through the distribution handlers (answers-driven), enabling multilingual content-type tests. @ericof 



### Frontend

#### Internal

- Upgrade to Volto 19.1.0. @sneridagh 



### Project


#### Internal

- Update `.vscode/settings.json`. @ericof 



## 2.0.0a20 (2026-06-15)

### Backend

No significant changes.




### Frontend

#### Internal

- Move ReturnToOriginalToast from k.intra to k.core @Tishasoumya-02 



### Project

No significant changes.




## 2.0.0a19 (2026-05-15)

### Backend

No significant changes.




### Frontend

#### Feature

- Add "Customized Select" facet for search and event calendar blocks. @davisagli 



### Project

No significant changes.




## 2.0.0a18 (2026-05-06)

### Backend

No significant changes.




### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0a17 (2026-05-06)

### Backend


#### Bug fixes:

- Update to plone.app.querystring 2.1.7 (includes fix for TypeError in event calendar
  block, and a fix for sort_on that was previously only in plone.app.querystring
  3.x). @davisagli 



### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0a16 (2026-05-06)

### Backend


#### Internal:

- Revert "Update to plone.app.querystring 2.1.6 @sneridagh [#120](https://github.com/kitconcept/kitconcept-core/issues/120)



### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0a15 (2026-05-06)

### Backend


#### Bug fixes:

- Update to plone.app.querystring 2.1.6 (fix for TypeError in event calendar block). @davisagli [#14](https://github.com/kitconcept/kitconcept-core/issues/14)
- Fix "Plone Site" objects not having `language` field by adding `plone.dublincore`. @jnptk 
- Upgrade to VLT 8a25.
  https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a25 @sneridagh 



### Frontend

#### Bugfix

- Upgrade to VLT 8a25.
  https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a25 @sneridagh 

#### Internal

- Improved and fixed script for upgrading project based dists. @sneridagh [#115](https://github.com/kitconcept/kitconcept-core/issue/115)



### Project


#### Documentation

- Improved and fixed script for upgrading project based dists. @sneridagh [#115](https://github.com/kitconcept/kitconcept-core/pull/115)
- Added release process documentation. @sneridagh 



## 2.0.0a14 (2026-03-31)

### Backend

No significant changes.




### Frontend

#### Feature

- Moved the `kitconcept.blocks.config` inherit expander in here from the intranet distribution. @sneridagh 
- Use timestamp and site title to name export file. @danalvrz 



### Project


#### Documentation

- Add docs for how to upgrade a distribution. @kittauri 



## 2.0.0a13 (2026-03-14)

### Backend

No significant changes.




### Frontend

#### Breaking

- Removed add-ons from frontend, moved to the distributions. @sneridagh 
- Replaced support of `@mbarde/volto-image-crop-widget` with `@plone-collective/volto-image-editor`. @sneridagh 

#### Feature

- Improve UX on Export Import control panel and add missing German translations. @danalvrz 

#### Internal

- Use Volto 19a27.
  See https://github.com/plone/volto/releases/tag/19.0.0-alpha.27 @sneridagh 



### Project

No significant changes.




## 2.0.0a12 (2026-02-27)

### Backend

No significant changes.




### Frontend

#### Bugfix

- Fix content export. @davisagli 



### Project

No significant changes.




## 2.0.0a11 (2026-02-26)

### Backend


#### New features:

- Added pt_BR Translations. @humanaice [#105](https://github.com/kitconcept/kitconcept-core/issues/105)


#### Internal:

- Add separate command for upgrading backend dependencies. @davisagli 
- Update translation. @iFlameing 



### Frontend

#### Feature

- Include `scripts` folder with the files needed to setup a project based on a distribution. @sneridagh [#101](https://github.com/kitconcept/kitconcept-core/issue/101)
- Add controlpanel to export and import content. @iFlameing 

#### Internal

- Added pt_BR Translations. @humanaice [#105](https://github.com/kitconcept/kitconcept-core/issue/105)
- Remove VLT as a direct dependency of `@kitconcept/core`.
  The specific version should be managed in a distribution instead.
  This avoids the need to release `@kitconcept/core` just to include a new release of VLT.
  @davisagli 



### Project


#### Internal

- Add command for upgrading dependencies. @davisagli 


#### Documentation

- Add documentation for importing and exporting content via the Import/Export control panel. @iFlameing 
- Ensure versions documentation for project based on distributions. @sneridagh 



## 2.0.0a10 (2026-02-16)

### Backend


#### New features:

- Pinned plone.exportimport 2.0.0a2. It enables the RESTAPI services for export/import. @sneridagh 


#### Bug fixes:

- Volto 19a25 VLT 8a16.
  See https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a16 @sneridagh 



### Frontend

#### Bugfix

- Volto 19a25 VLT 8a16.
  See https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a16 @sneridagh 



### Project


#### Documentation

- Improve documentation explaining the reason behind kitconcept.core and how to upgrade it. @ericof 



## 2.0.0a9 (2026-01-26)

### Backend


#### New features:

- Add script to move/rename content objects. @jnptk 
- Added a control panel setting for disabling the link for Person content types in teasers and listings. @iFlameing 


#### Bug fixes:

- Update to plone.volto 5.2.4. Adds getRemoteUrl to default summary serialization. @jackahl @davisagli [#91](https://github.com/kitconcept/kitconcept-core/issues/91)


#### Internal:

- Update to VLT 8a9: https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a13 @sneridagh 
- Upgrade to Volto 6.1.4. @sneridagh 



### Frontend

#### Internal

- Update to VLT 8a9: https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a13 @sneridagh 



### Project


#### Internal

- Removed coverage tests from CI. @sneridagh 


#### Documentation

- Add docs for how to upgrade Plone. @sneridagh 
- Add short how-to in docs explaining how to use the `move_rename_object.py` script. @jnptk 
- Updated the instructions to install VLT via the styleguide. @TimoBroeskamp 



## 2.0.0a8 (2026-01-15)

### Backend


#### New features:

- Add script for reindexing content. @jnptk 



### Frontend

#### Internal

- Remove `Contents` customization for the D&D files, since it's core now. @sneridagh 



### Project


#### Documentation

- Add short how-to in docs explaining how to use the `reindex_content.py` script. @jnptk 



## 2.0.0a7 (2026-01-14)

### Backend


#### Bug fixes:

- Fixed sticky menu cut off at the bottom on smaller screens @iRohitSingh
  Fixed double navigation in cards that contains inner links in its body. @sneridagh
  Fixed rearrangement of files in drag-and-drop of folderish content. @Tishasoumya-02 



### Frontend

#### Bugfix

- Fixed sticky menu cut off at the bottom on smaller screens @iRohitSingh
  Fixed double navigation in cards that contains inner links in its body. @sneridagh
  Fixed rearrangement of files in drag-and-drop of folderish content. @Tishasoumya-02 



### Project

No significant changes.




## 2.0.0a6 (2025-12-11)

### Backend


#### Bug fixes:

- Rename Location criterion to Path. @davisagli [#222](https://github.com/kitconcept/kitconcept-core/issues/222)
- Update to collective.person 1.0.0b4 (fixes validation of username field). @davisagli 



### Frontend

No significant changes.


### Project

No significant changes.




## 2.0.0a5 (2025-12-08)

### Backend


#### New features:

- Update to VLT 8a9:
  https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a9 @sneridagh 


#### Bug fixes:

- Fixed backend deps due to typos in previous dist.plone.org incarnations. @sneridagh 



### Frontend

#### Feature

- Add feature of drag and drop files in folder contents @Tishasoumya-02 
- Update to VLT 8a9:
  https://github.com/kitconcept/volto-light-theme/releases/tag/8.0.0a9 @sneridagh 



### Project

No significant changes.




## 2.0.0a4 (2025-12-01)

### Backend


#### Internal:

- Several bugfixes. Update to VLT8a8. @sneridagh 



### Frontend

#### Internal

- Several bugfixes. Update to VLT8a8. @sneridagh 



### Project

No significant changes.




## 2.0.0a3 (2025-11-27)

### Backend


#### Internal:

- Update to VLT 8a7 (Razzle fork). @sneridagh 



### Frontend

#### Internal

- Update to VLT 8a7 (Razzle fork). @sneridagh 



### Project

No significant changes.




## 2.0.0a2 (2025-11-13)

### Backend


#### Internal:

- Update to VLT8a6. @sneridagh 



### Frontend

#### Internal

- Update to VLT8a6. @sneridagh 
- Update to Volto 19a13. @sneridagh 



### Project


#### Internal

- Added acceptance tests. @sneridagh [#70](https://github.com/kitconcept/kitconcept-core/pull/70)



## 2.0.0a1 (2025-11-11)

### Backend


#### Internal:

- Use native namespaces. @sneridagh [#vlt8a5](https://github.com/kitconcept/kitconcept-core/issues/vlt8a5)



### Frontend

#### Feature

- New styleDefinitions registry powered. Improved ColorSwatch component. @sneridagh [#vlt8a5](https://github.com/kitconcept/kitconcept-core/issue/vlt8a5)

#### Bugfix

- Fixed intranet header. Fixed sticky menu. @sneridagh [#vlt8a5](https://github.com/kitconcept/kitconcept-core/issue/vlt8a5)



### Project

No significant changes.




## 2.0.0a0 (2025-11-04)

### Backend


#### Internal:

- Use Volto 19.0.0a3, vlt 8a3. @sneridagh 



### Frontend

#### Internal

- Use Volto 19.0.0a3, vlt 8a3. @sneridagh 



### Project


#### Internal

- Fixed CI for changelog workflow support branch 1.x.x and added support for node 24. @sneridagh 



## 1.0.0b7 (2025-11-04)

### Backend


#### Bug fixes:

- No significant changes. @sneridagh 



### Frontend

#### Bugfix

- Several bugfixes. @sneridagh 



### Project

No significant changes.




## 1.0.0b6 (2025-10-31)

### Backend

No significant changes.




### Frontend

#### Internal

- Several fixes - Update Volto to 18.29.0.
  Several fixes including File in listings missing pipe - Update to VLT 7.5.1 @sneridagh 



### Project

No significant changes.




## 1.0.0b5 (2025-10-08)

### Backend


#### Bug fixes:

- Remove pinnings, update locks. @sneridagh 



### Frontend

#### Bugfix

- Update to Volto 18.28.1. @sneridagh 



### Project

No significant changes.




## 1.0.0b4 (2025-10-07)

### Backend


#### New features:

- Misc fixes. Update Plone 6.1.3, Volto 18.28.0, VLT 7.3.0. @sneridagh [#64](https://github.com/kitconcept/kitconcept-core/issues/64)



### Frontend

#### Feature

- Misc fixes. Update Plone 6.1.3, Volto 18.28.0, VLT 7.3.0. @sneridagh [#64](https://github.com/kitconcept/kitconcept-core/issue/64)



### Project

No significant changes.




## 1.0.0b3 (2025-10-01)

### Backend


#### Bug fixes:

- Added smartTextRenderer, fix icons in calendar, fix low res images in cards, fix regression in teasers in edit mode. @sneridagh 



### Frontend

#### Bugfix

- Added smartTextRenderer, fix icons in calendar, fix low res images in cards, fix regression in teasers in edit mode. @sneridagh 



### Project

No significant changes.




## 1.0.0b2 (2025-09-29)

### Backend


#### Bug fixes:

- Fixed CSS issue with top blocks. Upgrade to Volto 18.27.2 and VLT 7.1.0 @sneridagh 



### Frontend

#### Bugfix

- Fixed CSS issue with top blocks. Upgrade to Volto 18.27.2 and VLT 7.1.0 @sneridagh 



### Project


#### Documentation

- Frontend styleguide. @sneridagh 



## 1.0.0b1 (2025-09-26)

### Backend

No significant changes.




### Frontend

#### Bugfix

- Update volto-authomatic to 3.0.0-alpha.6. @iFlameing 



### Project

No significant changes.




## 1.0.0b0 (2025-09-25)

### Backend


#### Internal:

- Use VLT 7.0.0 final. @sneridagh 



### Frontend

#### Internal

- Use VLT 7.0.0 final. @sneridagh 



### Project

No significant changes.




## 1.0.0a31 (2025-09-24)

### Backend


#### Bug fixes:

- Update to kitconcept.voltolighttheme 7.0.0b7. @davisagli 



### Frontend

#### Bugfix

- Update to @kitconcept/volto-light-theme 7.0.0-beta.7. @davisagli 



### Project

No significant changes.




## 1.0.0a30 (2025-09-18)

### Backend


#### New features:

- Transfer core features from intranet distribution to here: TTWCustomCSS and TTWBlocksConfig. @sneridagh [#53](https://github.com/kitconcept/kitconcept-core/issues/53)


#### Bug fixes:

- Builder image: Always compile .mo files, even if they are already present. @ericof 


#### Internal:

- Update to VLT 7b5. @sneridagh 



### Frontend

#### Feature

- Transfer core features from intranet distribution to here: TTWCustomCSS and TTWBlocksConfig. @sneridagh [#53](https://github.com/kitconcept/kitconcept-core/issue/53)

#### Bugfix

- Better buttons in slider add item. Refresh content button in slider. @sneridagh 



### Project

No significant changes.




## 1.0.0a29 (2025-09-17)

### Backend


#### Internal:

- Move the office_phone and fax to collective.contact_behaviours. @iFlameing 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a28 (2025-09-16)

### Backend


#### New features:

- Add behavior `kitconcept.core.additional_contact_info` with fields address, office_phone and fax field. @iFlameing 
- Person: Add behavior `kitconcept.core.biography` with field `biography`. @ericof 


#### Bug fixes:

- Use VLT 7b4 and plonegovbr/social-media 2.0.0a8. @sneridagh 



### Frontend

#### Bugfix

- Fixed theme CSS properties injection in add/edit view. Several CSS fixes. Use VLT 7b4 and plonegovbr/social-media 2.0.0a8. @sneridagh 



### Project

No significant changes.




## 1.0.0a27 (2025-09-15)

### Backend


#### Internal:

- Added missing upgrade step in previous version (1.0.0a26). @sneridagh 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a26 (2025-09-15)

### Backend


#### Bug fixes:

- Fixed blocks behavior removal by getting rid of `model_schema` from c.person. @sneridagh 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a25 (2025-09-12)

### Backend


#### Bug fixes:

- Update to kitconcept.voltolighttheme 7.0.0b2. @davisagli 



### Frontend

#### Bugfix

- Update to @kitconcept/volto-light-theme 7.0.0-beta.2. @davisagli 
- Update to Volto 18.26.0. @davisagli 



### Project

No significant changes.




## 1.0.0a24 (2025-09-12)

### Backend


#### Bug fixes:

- Fix translations of Person behaviors. @davisagli 
- Upgrade to collective.person 1.0.0b2 to improve the Person schema. @davisagli 



### Frontend

No significant changes.


### Project

No significant changes.




## 1.0.0a23 (2025-09-08)

### Backend


#### Bug fixes:

- Fixed slider flag position button in simple variant. Changed svg events calendar variant. Update VLT 7a28. @sneridagh 



### Frontend

#### Bugfix

- Fixed slider flag position button in simple variant. Changed svg events calendar variant. Update VLT 7a28. @sneridagh 



### Project


#### Documentation

- Enable docs in core. https://kitconcept-core.readthedocs.io/ @sneridagh 



## 1.0.0a22 (2025-09-04)

### Backend


#### Bug fixes:

- Fix person grid teasers in edit mode. Update VLT 7a27. @sneridagh 



### Frontend

#### Bugfix

- Fix person grid teasers in edit mode. Update VLT 7a27. @sneridagh 



### Project

No significant changes.




## 1.0.0a21 (2025-09-03)

### Backend


#### Bug fixes:

- Fix image widget and new slider variant. Update to VLT 7a26. @sneridagh 



### Frontend

#### Bugfix

- Fix image widget and new slider variant. Update to VLT 7a26. @sneridagh 



### Project

No significant changes.




## 1.0.0a21 (2025-09-03)

### Backend


#### Bug fixes:

- Fix image widget and new slider variant. Update to VLT 7a26. @sneridagh 



### Frontend

#### Bugfix

- Fix image widget and new slider variant. Update to VLT 7a26. @sneridagh 



### Project

No significant changes.


## 1.0.0a20 (2025-09-03)

### Backend


#### New features:

- Update core to Plone 6.1.2 @sneridagh [#39](https://github.com/kitconcept/kitconcept-core/issues/39)
- Move from `preview_image_link` to `kitconcept.core.person_image` attribute-based field. @sneridagh [#40](https://github.com/kitconcept/kitconcept-core/issues/40)


#### Internal:

- Due to a problem with the last release, re-releasing. @sneridagh 



### Frontend

#### Internal

- Due to a problem with the last release, re-releasing. @sneridagh 



### Project

No significant changes.




## 1.0.0a19 (2025-09-03)

### Backend


#### New features:

- Update core to Plone 6.1.2 @sneridagh [#39](https://github.com/kitconcept/kitconcept-core/issues/39)
- Move from `preview_image_link` to `kitconcept.core.person_image` attribute-based field. @sneridagh [#40](https://github.com/kitconcept/kitconcept-core/issues/40)



### Frontend

#### Feature

- Update to Volto 18.25.0 @sneridagh 



### Project

No significant changes.




## 1.0.0a18 (2025-09-01)

### Backend


#### Bug fixes:

- Several VLT bugfixes. Update to VLT 7a25. @sneridagh 



### Frontend

#### Bugfix

- Several VLT bugfixes. Update to VLT 7a25. @sneridagh 



### Project

No significant changes.




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




