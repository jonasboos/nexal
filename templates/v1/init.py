import os
import subprocess
import sys
import argparse


# -----------------------------
# CLI / Konfiguration
# -----------------------------
def parse_args():
    parser = argparse.ArgumentParser(description="Create and initialize a new project using Nexal.")
    parser.add_argument("--base-dir", default=r"D:\\GITHUB", help="Base directory where project folder will be created")
    parser.add_argument("--project-name", default="saas-tests", help="Name of the project folder and GitHub repo")
    parser.add_argument("--visibility", choices=["public", "private"], default="private", help="GitHub repo visibility")
    parser.add_argument("--dry-run", action="store_true", help="Print actions but do not execute PowerShell commands")
    parser.add_argument("--auto-n", action="store_true", help="Automatically answer 'n' to the nexal prompt")
    return parser.parse_args()


def main():
    args = parse_args()

    base_dir = args.base_dir
    project_name = args.project_name
    visibility = args.visibility

    project_path = os.path.join(base_dir, project_name)

    # -----------------------------
    # Ordner erstellen
    # -----------------------------
    os.makedirs(project_path, exist_ok=True)
    print(f"Ordner erstellt: {project_path}")

    # -----------------------------
    # .gitignore erstellen
    # -----------------------------
    gitignore_content = """node_modules
.env
.next
"""
    gitignore_path = os.path.join(project_path, ".gitignore")
    with open(gitignore_path, "w") as f:
        f.write(gitignore_content)
    print(".gitignore erstellt.")

    # -----------------------------
    # PowerShell-Befehle vorbereiten
    # -----------------------------
    # If --auto-n is set, pipe a single 'n' into nexal to answer its prompt
    nexal_cmd = "echo n | npx nexal" if args.auto_n else "npx nexal"

    powershell_commands = f"""
cd "{project_path}"
git init
git add .
git commit -m "Initial commit"
# GitHub Repo erstellen, nur falls es noch nicht existiert
if (-not (gh repo view {project_name} -ErrorAction SilentlyContinue)) {{
    gh repo create {project_name} --{visibility} --source=. --remote=origin
}}
# npx nexal starten (Eingaben manuell oder automatisiert)
{nexal_cmd}
git add .
git commit -m "Setup via Nexal"
git push -u origin main
pause
"""

    if args.dry_run:
        print("--- Dry run: PowerShell commands that would be executed ---")
        print(powershell_commands)
        return

    # -----------------------------
    # PowerShell starten und Befehle ausführen
    # -----------------------------
    ps_command = ["powershell", "-NoExit", "-Command", powershell_commands]

    print("Öffne PowerShell und führe alle Befehle aus...")
    subprocess.run(ps_command)


if __name__ == "__main__":
    main()
