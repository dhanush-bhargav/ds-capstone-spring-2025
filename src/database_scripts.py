from config_reader import ConfigData
import sqlite3

#Create SQLite DB file at configured path and open a connection
config_data = ConfigData("config.conf")
connection = sqlite3.connect(config_data.get_value("Memory", "db_path"))
cursor = connection.cursor()

#Create users table
cursor.execute("""CREATE TABLE users (
                      user_id VARCHAR(255) NOT NULL,
                      user_name VARCHAR(255) NOT NULL,
                      password VARCHAR(255) NOT NULL
                    )""")

# Create topic_groups table
cursor.execute("""CREATE TABLE topic_groups (
                      group_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      group_name TEXT NOT NULL
                    )""")

# Create master_topics table
cursor.execute("""CREATE TABLE master_topics (
                      group_id INTEGER NOT NULL,
                      topic_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_description TEXT NOT NULL
                    )""")

# Create link_conversation_user_topic table
cursor.execute("""CREATE TABLE link_conversations_user_topic (
                      conversation_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      user_id INTEGER NOT NULL
                    )""")

# Create instructions table
cursor.execute("""CREATE TABLE instructions (
                    order_id INTEGER PRIMARY KEY AUTOINCREMENT,
                    instruction TEXT NOT NULL,
                    intended_for VARCHAR(50) NOT NULL)""")

# Create table to store argument categories
cursor.execute("""CREATE TABLE master_argument_categories (
                      category_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      argument_category TEXT NOT NULL
                    )""")

# Create table to store arguments
cursor.execute("""CREATE TABLE master_arguments (
                      argument_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      topic_id INTEGER NOT NULL,
                      yes_or_no VARCHAR(5) NOT NULL,
                      argument TEXT NOT NULL
                    )""")

# Create table to link arguments and categories
cursor.execute("""CREATE TABLE link_argument_categories (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    category_id INTEGER NOT NULL,
                    argument_id INTEGER NOT NULL
                    )""")

#Create table to store users' stances
cursor.execute("""CREATE TABLE stances (
                      stance_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      conversation_id INTEGER NOT NULL,
                      stance TEXT NOT NULL,
                      stance_rating INTEGER NOT NULL CHECK(stance_rating BETWEEN 1 AND 10),
                      collected_at VARCHAR(25) NOT NULL
                    )""")

# Create table to store implications rating by users
cursor.execute("""CREATE TABLE implications (
                      implication_id INTEGER PRIMARY KEY AUTOINCREMENT,
                      conversation_id INTEGER NOT NULL,
                      category_id INTEGER NOT NULL,
                      argument_id INTEGER NOT NULL,
                      implication VARCHAR(255) NOT NULL
                    )""")

# Populate users table with default users
users_data = [
    ("dhanush", "Dhanush Bhargav", "abc@123"),
    ("guruksha", "Guruksha Gurnani", "abc@123"),
]

cursor.executemany("INSERT INTO users VALUES (?, ?, ?)", users_data)
connection.commit()

# Populate topic_groups table with default topic groups
topic_groups_data = [
    ("Politics and Governance",),
    ("Social and Cultural Issues",),
    ("Healthcare and Science",),
    ("Environment and Climate",),
    ("Economic and Labor Issues",),
    ("Law and Criminal Justice",),
    ("Technology and Privacy",),
    ("Education",),
    ("Immigration",),
    ("Miscellaneous",)
]
cursor.executemany("INSERT INTO topic_groups (group_name) VALUES (?)", topic_groups_data)
connection.commit()

# Populate master_topics table with default topics
topics = [
    (1, 'Should the Electoral College be abolished?'),
    (1, 'Should gerrymandering be outlawed nationwide?'),
    (1, 'Should term limits be implemented for Congress members?'),
    (1, 'Should Puerto Rico and Washington, D.C., be granted statehood?'),
    (1, 'Should the filibuster in the Senate be eliminated?'),
    (1, 'Should there be stricter limits on campaign donations?'),
    (1, 'Should the U.S. Supreme Court have term limits for justices?'),
    (1, 'Should political advertisements on social media be banned?'),
    (1, 'Should foreign-born U.S. residents be allowed to run for president?'),
    (1, 'Should the government mandate civics education for all public schools?'),
    (2, 'Should transgender athletes compete in sports teams aligned with their gender identity?'),
    (2, 'Should Critical Race Theory be taught in public schools?'),
    (2, 'Should Confederate monuments be removed from public spaces?'),
    (2, 'Should reparations be paid to descendants of enslaved people?'),
    (2, 'Should book bans be implemented in schools and libraries?'),
    (2, 'Should hate speech laws be expanded in the U.S.?'),
    (2, 'Should Native American mascots be banned in sports?'),
    (2, 'Should same-sex marriage be federally protected?'),
    (2, 'Should drag performances be restricted in public spaces?'),
    (2, 'Should parents have the right to dictate school curriculums?'),
    (3, 'Should abortion be federally legalized?'),
    (3, 'Should birth control be available over the counter?'),
    (3, 'Should gender-affirming care for minors be banned?'),
    (3, 'Should universal healthcare replace private insurance systems?'),
    (3, 'Should assisted suicide be legalized nationwide?'),
    (3, 'Should COVID-19 vaccine mandates be enforced for public workers?'),
    (3, 'Should the government fund harm reduction programs for drug users?'),
    (3, 'Should stem cell research restrictions be lifted?'),
    (3, 'Should organ donations be opt-out by default?'),
    (3, 'Should healthcare workers be required to provide abortions if requested?'),
    (4, 'Should the U.S. ban all oil drilling on public lands?'),
    (4, 'Should the U.S. implement a carbon tax?'),
    (4, 'Should nuclear power be considered a key part of green energy solutions?'),
    (4, 'Should plastic bags and single-use plastics be banned?'),
    (4, 'Should offshore drilling be prohibited?'),
    (4, 'Should fracking be banned nationwide?'),
    (4, 'Should the U.S. rejoin the Paris Climate Agreement (if it left again)?'),
    (4, 'Should the government subsidize electric vehicles?'),
    (4, 'Should environmental regulations be relaxed to boost economic growth?'),
    (4, 'Should meat consumption be taxed to address climate change?'),
    (5, 'Should the federal minimum wage be raised to $15/hour?'),
    (5, 'Should the government forgive all student loans?'),
    (5, 'Should there be a wealth tax on billionaires?'),
    (5, 'Should unions be mandatory for certain industries?'),
    (5, 'Should gig workers like Uber drivers receive employee benefits?'),
    (5, 'Should employers be required to provide paid family leave?'),
    (5, 'Should rent control laws be implemented nationwide?'),
    (5, 'Should universal basic income (UBI) be adopted?'),
    (5, 'Should tipping culture in restaurants be eliminated?'),
    (5, 'Should Social Security benefits be privatized?'),
    (6, 'Should the death penalty be abolished?'),
    (6, 'Should private prisons be banned?'),
    (6, 'Should recreational marijuana be legalized nationwide?'),
    (6, 'Should police departments be defunded or restructured?'),
    (6, 'Should hate crime laws be expanded to include more categories?'),
    (6, 'Should felons be allowed to vote while incarcerated?'),
    (6, 'Should mandatory minimum sentences be eliminated?'),
    (6, 'Should cash bail be abolished?'),
    (6, 'Should gun manufacturers be held liable for gun violence?'),
    (6, 'Should facial recognition technology be banned in law enforcement?'),
    (7, 'Should social media companies be required to verify users\' identities?'),
    (7, 'Should online anonymity be outlawed?'),
    (7, 'Should tech companies be broken up under antitrust laws?'),
    (7, 'Should AI-generated content be labeled as such?'),
    (7, 'Should the government ban TikTok due to security concerns?'),
    (7, 'Should internet access be considered a public utility?'),
    (7, 'Should encryption be mandatory for all personal communication devices?'),
    (7, 'Should employees be monitored electronically in the workplace?'),
    (7, 'Should data collection by companies require explicit consent?'),
    (7, 'Should autonomous vehicles be allowed on public roads?'),
    (8, 'Should public universities offer free tuition for all students?'),
    (8, 'Should school vouchers be funded by the government?'),
    (8, 'Should teachers be allowed to carry firearms in schools?'),
    (8, 'Should religious education be part of public school curricula?'),
    (8, 'Should charter schools receive public funding?'),
    (8, 'Should standardized testing be eliminated in schools?'),
    (8, 'Should homeschooling regulations be more stringent?'),
    (8, 'Should sex education be mandatory in all states?'),
    (8, 'Should students be required to learn a second language?'),
    (8, 'Should schools require students to wear uniforms?'),
    (9, 'Should a border wall be built along the U.S.-Mexico border?'),
    (9, 'Should illegal immigrants have a pathway to citizenship?'),
    (9, 'Should asylum seekers be detained while their cases are processed?'),
    (9, 'Should sanctuary cities be outlawed?'),
    (9, 'Should refugees from climate-affected regions be prioritized for asylum?'),
    (9, 'Should the number of legal immigrants allowed into the U.S. be reduced?'),
    (9, 'Should English be the official language of the U.S.?'),
    (9, 'Should undocumented immigrants have access to public benefits?'),
    (9, 'Should the U.S. abolish Immigration and Customs Enforcement (ICE)?'),
    (9, 'Should birthright citizenship be eliminated?'),
    (10, 'Should the Second Amendment be repealed or revised?'),
    (10, 'Should the legal voting age be lowered to 16?'),
    (10, 'Should daylight saving time be abolished?'),
    (10, 'Should the drinking age be lowered to 18?'),
    (10, 'Should the Pledge of Allegiance be mandatory in schools?'),
    (10, 'Should professional athletes be required to stand during the national anthem?'),
    (10, 'Should the government ban violent video games for minors?'),
    (10, 'Should cryptocurrency be outlawed?'),
    (10, 'Should reparations be paid to Holocaust survivors\' families in the U.S.?'),
    (10, 'Should the U.S. adopt a four-day workweek?')
]

cursor.executemany("INSERT INTO master_topics (group_id, topic_description) VALUES (?, ?)", topics)
connection.commit()

connection.close()