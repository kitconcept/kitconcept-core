from importlib.metadata import PackageNotFoundError
from importlib.metadata import version


def package_version(package_name: str) -> str:
    """Return the version of an installed package.

    :param package_name: Distribution name of the package.
    :returns: Version of the package, or ``-`` if no distribution was found.
    """
    if not package_name:
        return "-"
    try:
        return version(package_name)
    except PackageNotFoundError:
        # Probably a sub package (i.e. kitconcept.core.testing)
        package_name = (
            ".".join(package_name.split(".")[:-1]) if "." in package_name else ""
        )
        return package_version(package_name)
