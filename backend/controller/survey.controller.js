const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require("uuid");

class SurveyController {
  constructor(db) {
    this.db = db;
  }

  // Создание опроса
  async createSurvey(req, res) {
    const { id, user_id, type } = req.body;
    const client = await this.db.connect();
    try {
      const result = await client.query(
        `INSERT INTO Survey (id, user_id, title, type, settings) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
        [id, user_id, "", type, {}]
      );
      res.status(201).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка при создании опроса:", err);
      res.status(500).json({ message: "Ошибка при создании опроса" });
    } finally {
      client.release();
    }
  }

  // Редактирование опроса
  async editSurvey(req, res) {
    const { id } = req.params;
    const { title, description, settings } = req.body;
    const client = await this.db.connect();

    try {
      const query = `
                UPDATE Survey 
                SET 
                    title = COALESCE($1, title),
                    description = COALESCE($2, description),
                    settings = COALESCE($3, settings)
                WHERE id = $4
                RETURNING *;
            `;

      const result = await client.query(query, [
        title,
        description,
        settings,
        id,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Опрос не найден" });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка при редактировании опроса:", err);
      res.status(500).json({ message: "Ошибка при редактировании опроса" });
    } finally {
      client.release();
    }
  }

  // Получение опросов пользователя
  async getSurveysByUserId(req, res) {
    const { id } = req.params;
    const client = await this.db.connect();
    try {
      const result = await client.query(
        `
            SELECT 
                s.id,
                s.title,
                s.description,
                s.type,
                s.settings
            FROM 
                public.survey s
            JOIN 
                public.person p ON s.user_id = p.id
            WHERE 
                p.id = $1
          `,
        [id]
      );

      res.status(200).json(result.rows);
    } catch (err) {
      console.error("Ошибка при получении опросов:", err);
      res.status(500).json({ message: "Ошибка при получении опросов" });
    } finally {
      client.release();
    }
  }

  // Получение данных опроса
  async getSurvey(req, res) {
    const { id } = req.params;
    const client = await this.db.connect();

    try {
      const query = `SELECT * FROM Survey WHERE id = $1;`;
      const result = await client.query(query, [id]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Опрос не найден" });
      }

      res.status(200).json(result.rows[0]);
    } catch (err) {
      console.error("Ошибка при получении данных опроса:", err);
      res.status(500).json({ message: "Ошибка при получении данных опроса" });
    } finally {
      client.release();
    }
  }

  // Создание вопроса
  async createQuestion(req, res) {
    const { surveyId } = req.params;
    const questions = req.body;

    const client = await this.db.connect();
    const savedQuestions = [];

    try {
      for (const question of questions) {
        const {
          question_text,
          question_type,
          is_required,
          answer_type,
          feature_description,
          options,
          correct_answers,
        } = question;
        const newQuestionId = uuidv4();

        const questionResult = await client.query(
          `INSERT INTO question (id, survey_id, question_text, question_type, is_required, answer_type, feature_description) 
           VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
          [
            newQuestionId,
            surveyId,
            question_text || "",
            question_type || "",
            is_required,
            answer_type || "single",
            feature_description || null,
          ]
        );

        const savedQuestion = questionResult.rows[0];
        console.log("Question saved:", savedQuestion.id);

        if (options && options.length > 0) {
          const savedOptions = [];
          for (let i = 0; i < options.length; i++) {
            const isCorrect = Array.isArray(correct_answers)
              ? correct_answers.includes(i)
              : false;
            console.log("isCorrect", correct_answers, isCorrect);
            const optionResult = await client.query(
              `INSERT INTO answeroption (question_id, text, is_correct) 
               VALUES ($1, $2, $3) RETURNING *`,
              [savedQuestion.id, options[i], isCorrect]
            );
            savedOptions.push(optionResult.rows[0]);
          }
          savedQuestion.options = savedOptions;
        }

        savedQuestions.push(savedQuestion);
      }

      res.status(201).json(savedQuestions);
    } catch (err) {
      console.error("Ошибка при создании вопроса:", err);
      res.status(500).json({ message: "Ошибка при создании вопроса" });
    } finally {
      client.release();
    }
  }

  // Редактирование опроса
  async editQuestion(req, res) {
    const { questionId } = req.params;
    const {
      question_text,
      question_type,
      is_required,
      answer_type,
      feature_description,
      options,
      correctAnswers,
    } = req.body;

    const client = await this.db.connect();

    try {
      const query = `
        UPDATE question
        SET 
          question_text = COALESCE($1, question_text),
          question_type = COALESCE($2, question_type),
          is_required = COALESCE($3, is_required),
          answer_type = COALESCE($4, answer_type),
          feature_description = COALESCE($5, feature_description)
        WHERE id = $6
        RETURNING *;
      `;

      const result = await client.query(query, [
        question_text,
        question_type,
        is_required,
        answer_type || "single",
        feature_description || null,
        questionId,
      ]);

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Вопрос не найден" });
      }

      const updatedQuestion = result.rows[0];
      if (options && options.length > 0) {
        await client.query(`DELETE FROM answeroption WHERE question_id = $1`, [
          questionId,
        ]);

        const savedOptions = [];
        for (let i = 0; i < options.length; i++) {
          const isCorrect = Array.isArray(correctAnswers)
            ? correctAnswers.includes(i)
            : false;
          const optionResult = await client.query(
            `INSERT INTO answeroption (question_id, text, is_correct) 
             VALUES ($1, $2, $3) RETURNING *`,
            [questionId, options[i], isCorrect]
          );
          savedOptions.push(optionResult.rows[0]);
        }
        updatedQuestion.options = savedOptions;
      }

      res.status(200).json(updatedQuestion);
    } catch (err) {
      console.error("Ошибка при редактировании вопроса:", err);
      res.status(500).json({ message: "Ошибка при редактировании вопроса" });
    } finally {
      client.release();
    }
  }

  // Получение вопросов из опроса
  async getQuestionsBySurveyId(req, res) {
    const { surveyId } = req.params;

    const client = await this.db.connect();

    try {
      const questionResult = await client.query(
        `SELECT id, question_text, question_type, is_required, answer_type, feature_description
          FROM question
          WHERE survey_id = $1`,
        [surveyId]
      );
      const questions = questionResult.rows;

      for (const question of questions) {
        const optionResult = await client.query(
          `SELECT id, text, is_correct 
           FROM answeroption 
           WHERE question_id = $1`,
          [question.id]
        );
        question.options = optionResult.rows;
      }

      res.status(200).json(questions);
    } catch (err) {
      console.error("Ошибка при получении вопросов:", err);
      res.status(500).json({ message: "Ошибка при получении вопросов" });
    } finally {
      client.release();
    }
  }

  // Удаление опроса
  async deleteSurvey(req, res) {
    const { surveyId } = req.params;
    const client = await this.db.connect();

    try {
      await client.query(
        `DELETE FROM answeroption WHERE question_id IN (SELECT id FROM question WHERE survey_id = $1)`,
        [surveyId]
      );
      await client.query(`DELETE FROM question WHERE survey_id = $1`, [
        surveyId,
      ]);

      const result = await client.query(
        `DELETE FROM Survey WHERE id = $1 RETURNING *`,
        [surveyId]
      );

      if (result.rows.length === 0) {
        return res.status(404).json({ message: "Опрос не найден" });
      }

      res.status(200).json({ message: "Опрос успешно удален" });
    } catch (err) {
      console.error("Ошибка при удалении опроса:", err);
      res.status(500).json({ message: "Ошибка при удалении опроса" });
    } finally {
      client.release();
    }
  }

  // Создание копии опроса
  async duplicateSurvey(req, res) {
    const { surveyId } = req.params;
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const surveyResult = await client.query(
        `SELECT * FROM Survey WHERE id = $1`,
        [surveyId]
      );

      if (surveyResult.rows.length === 0) {
        return res.status(404).json({ message: "Опрос не найден" });
      }

      const originalSurvey = surveyResult.rows[0];

      const newSurveyId = uuidv4();
      const surveyCopyResult = await client.query(
        `INSERT INTO Survey (id, user_id, title, type, settings) 
         VALUES ($1, $2, $3, $4, $5) 
         RETURNING *`,
        [
          newSurveyId,
          originalSurvey.user_id,
          `${originalSurvey.title} (Копия)`,
          originalSurvey.type,
          originalSurvey.settings,
        ]
      );

      const newSurvey = surveyCopyResult.rows[0];

      const questionsResult = await client.query(
        `SELECT * FROM question WHERE survey_id = $1`,
        [surveyId]
      );

      for (const question of questionsResult.rows) {
        const newQuestionId = uuidv4();

        await client.query(
          `INSERT INTO question 
           (id, survey_id, question_text, question_type, is_required, answer_type, feature_description) 
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            newQuestionId,
            newSurveyId,
            question.question_text,
            question.question_type,
            question.is_required,
            question.answer_type,
            question.feature_description,
          ]
        );

        const optionsResult = await client.query(
          `SELECT * FROM answeroption WHERE question_id = $1`,
          [question.id]
        );

        for (const option of optionsResult.rows) {
          await client.query(
            `INSERT INTO answeroption (question_id, text, is_correct) 
             VALUES ($1, $2, $3)`,
            [newQuestionId, option.text, option.is_correct]
          );
        }
      }

      await client.query("COMMIT");
      res.status(201).json(newSurvey);
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Ошибка при создании копии опроса:", err);
      res.status(500).json({ message: "Ошибка при создании копии опроса" });
    } finally {
      client.release();
    }
  }

  // Удаление вопроса
  async deleteQuestion(req, res) {
    const { questionId } = req.params;
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      await client.query("DELETE FROM answeroption WHERE question_id = $1", [
        questionId,
      ]);

      const result = await client.query(
        "DELETE FROM question WHERE id = $1 RETURNING *",
        [questionId]
      );

      if (result.rowCount === 0) {
        return res.status(404).json({ message: "Вопрос не найден" });
      }

      await client.query("COMMIT");
      res.status(200).json({
        message: "Вопрос успешно удален",
        deletedQuestion: result.rows[0],
      });
    } catch (err) {
      await client.query("ROLLBACK");

      console.error("Ошибка при удалении вопроса:", err);
      res.status(500).json({ message: "Ошибка при удалении вопроса" });
    } finally {
      client.release();
    }
  }

  // Копирование вопроса
  async copyQuestion(req, res) {
    const { questionId } = req.params;
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const originalQuestion = await client.query(
        "SELECT * FROM question WHERE id = $1",
        [questionId]
      );

      if (originalQuestion.rowCount === 0) {
        return res
          .status(404)
          .json({ message: "Оригинальный вопрос не найден" });
      }

      const questionData = originalQuestion.rows[0];
      const newQuestionId = uuidv4();

      const newQuestion = await client.query(
        `INSERT INTO question (id, survey_id, question_text, question_type, is_required, answer_type, feature_description) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [
          newQuestionId,
          questionData.survey_id,
          questionData.question_text + " (копия)",
          questionData.question_type,
          questionData.is_required,
          questionData.answer_type,
          questionData.feature_description,
        ]
      );

      const options = await client.query(
        "SELECT * FROM answeroption WHERE question_id = $1",
        [questionId]
      );

      if (options.rowCount > 0) {
        const savedOptions = [];

        for (const option of options.rows) {
          const newOption = await client.query(
            `INSERT INTO answeroption (question_id, text, is_correct) 
           VALUES ($1, $2, $3) RETURNING *`,
            [newQuestionId, option.text, option.is_correct]
          );
          savedOptions.push(newOption.rows[0]);
        }
        newQuestion.rows[0].options = savedOptions;
      }

      await client.query("COMMIT");
      res.status(201).json(newQuestion.rows[0]);
    } catch (err) {
      await client.query("ROLLBACK");

      console.error("Ошибка при копировании вопроса:", err);
      res.status(500).json({ message: "Ошибка при копировании вопроса" });
    } finally {
      client.release();
    }
  }

  // Сохранение ответов
  async saveSurveyAnswers(req, res) {
    const { preparedAnswers } = req.body;
    const client = await this.db.connect();

    try {
      await client.query("BEGIN");

      const insertQuery = `
      INSERT INTO survey_answers (survey_id, question_id, question_type, answer)
      VALUES ($1, $2, $3, $4)
    `;

      for (const answer of preparedAnswers) {
        await client.query(insertQuery, [
          answer.surveyId,
          answer.questionId,
          answer.questionType,
          JSON.stringify(answer.answer),
        ]);
      }

      await client.query("COMMIT");
      res.status(200).json({ message: "Ответы успешно сохранены" });
    } catch (err) {
      await client.query("ROLLBACK");
      console.error("Ошибка при сохранении ответов:", err);
      res.status(500).json({ message: "Ошибка при сохранении ответов" });
    } finally {
      client.release();
    }
  }

  // Получение ответов опроса
  async getSurveyResults(req, res) {
    const { surveyId } = req.params;
    const client = await this.db.connect();

    try {
      const result = await client.query(
        `
        SELECT q.question_text as question_text, sa.answer
        FROM survey_answers sa
        JOIN question q ON sa.question_id = q.id
        WHERE sa.survey_id = $1::uuid
      `,
        [surveyId]
      );

      res.status(200).json(result.rows);
    } catch (error) {
      console.error("Ошибка при получении результатов:", error);
      res.status(500).json({ message: "Ошибка при получении результатов" });
    } finally {
      client.release();
    }
  }
}

module.exports = SurveyController;
