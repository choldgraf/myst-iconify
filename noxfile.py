import nox


@nox.session
def test(session):
    """Run the test suite."""
    session.run("npm", "install", external=True)
    session.run("npx", "vitest", "run", external=True)


@nox.session
def docs(session):
    """Build the documentation."""
    session.run("npx", "mystmd", "build", external=True)


@nox.session(name="docs-live")
def docs_live(session):
    """Start a live development server."""
    session.run("npx", "mystmd", "start", external=True)
