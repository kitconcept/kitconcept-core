# Change log

<!-- You should *NOT* be adding new change log entries to this file.
     You should create a file in the news directory instead.
     For helpful instructions, please see:
     https://6.docs.plone.org/contributing/index.html#contributing-change-log-label
-->

<!-- towncrier release notes start -->
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




