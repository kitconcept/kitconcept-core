from dataclasses import dataclass
from typing import Literal
from typing import NotRequired
from typing import overload
from typing import Protocol
from typing import TypedDict


class DistributionInfo(TypedDict):
    """Distribution Information."""

    name: str
    title: str
    package_name: str
    package_version: str


AnswersKeycloak = TypedDict(
    "AnswersKeycloak",
    {
        "provider": str,
        "oidc-server_url": str,
        "oidc-realm_name": str,
        "oidc-client_id": str,
        "oidc-client_secret": str,
        "oidc-site-url": str,
        "oidc-scope": list[str],
    },
)

AnswersOIDC = TypedDict(
    "AnswersOIDC",
    {
        "provider": str,
        "oidc-issuer": str,
        "oidc-client_id": str,
        "oidc-client_secret": str,
        "oidc-site-url": str,
        "oidc-scope": list[str],
    },
)

AnswersAuthomaticGoogle = TypedDict(
    "AnswersAuthomaticGoogle",
    {
        "provider": Literal["authomatic-google"],
        "authomatic-google-consumer_key": str,
        "authomatic-google-consumer_secret": str,
        "authomatic-google-scope": list[str],
    },
)
AnswersAuthomaticGitHub = TypedDict(
    "AnswersAuthomaticGitHub",
    {
        "provider": Literal["authomatic-github"],
        "authomatic-github-consumer_key": str,
        "authomatic-github-consumer_secret": str,
        "authomatic-github-scope": list[str],
    },
)

AnswersAuthomatic = AnswersAuthomaticGoogle | AnswersAuthomaticGitHub

AnswersIdentity = TypedDict(
    "AnswersIdentity",
    {
        "provider": Literal[
            "identity-keycloak", "identity-oidc", "identity-github", "identity-google"
        ],
        "identity-server_url": NotRequired[str],
        "identity-realm_name": NotRequired[str],
        "identity-issuer": NotRequired[str],
        "identity-client_id": str,
        "identity-client_secret": str,
        "identity-site-url": NotRequired[str],
        "identity-scope": NotRequired[list[str]],
    },
)

AuthAnswers = AnswersKeycloak | AnswersAuthomatic | AnswersOIDC | AnswersIdentity


class AuthSetupHandler(Protocol):
    @overload
    def __call__(self, answers: AnswersKeycloak) -> None: ...
    @overload
    def __call__(self, answers: AnswersOIDC) -> None: ...
    @overload
    def __call__(self, answers: AnswersAuthomatic) -> None: ...
    @overload
    def __call__(self, answers: AnswersIdentity) -> None: ...

    def __call__(self, answers: AuthAnswers) -> None: ...


@dataclass
class AuthenticationProvider:
    handler: AuthSetupHandler
    profiles: tuple[str, ...]
