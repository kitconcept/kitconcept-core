from dataclasses import dataclass
from typing import Literal
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

AuthAnswers = AnswersKeycloak | AnswersAuthomatic | AnswersOIDC


class AuthSetupHandler(Protocol):
    @overload
    def __call__(self, answers: AnswersKeycloak) -> None: ...
    @overload
    def __call__(self, answers: AnswersOIDC) -> None: ...
    @overload
    def __call__(self, answers: AnswersAuthomatic) -> None: ...

    def __call__(self, answers: AuthAnswers) -> None: ...


@dataclass
class AuthenticationProvider:
    handler: AuthSetupHandler
    profiles: tuple[str, ...]
