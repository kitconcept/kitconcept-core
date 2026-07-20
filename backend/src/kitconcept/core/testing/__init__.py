from kitconcept.core.testing import layers
from kitconcept.core.testing import robot
from plone.app.robotframework.remote import RemoteLibraryLayer
from plone.app.testing import FunctionalTesting
from plone.app.testing import IntegrationTesting
from plone.app.testing import PloneSandboxLayer
from plone.testing.zope import WSGI_SERVER_FIXTURE


kitconcept_FIXTURE = layers.CoreFixture()


class Layer(PloneSandboxLayer):
    defaultBases = (kitconcept_FIXTURE,)


FIXTURE = Layer()

INTEGRATION_TESTING = IntegrationTesting(
    bases=(FIXTURE,),
    name="kitconcept.coreLayer:IntegrationTesting",
)


FUNCTIONAL_TESTING = FunctionalTesting(
    bases=(FIXTURE, WSGI_SERVER_FIXTURE),
    name="kitconcept.coreLayer:FunctionalTesting",
)

REMOTE_LIBRARY_BUNDLE_FIXTURE = RemoteLibraryLayer(
    bases=(kitconcept_FIXTURE,),
    libraries=robot.RF_LIBRARIES,
    name="RemoteLibraryBundle:RobotRemote",
)

ACCEPTANCE_TESTING = FunctionalTesting(
    bases=(
        FIXTURE,
        REMOTE_LIBRARY_BUNDLE_FIXTURE,
        WSGI_SERVER_FIXTURE,
    ),
    name="kitconcept.coreLayer:AcceptanceTesting",
)
